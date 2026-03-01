import Provider from "@/app/provider";
import { connections } from "@/db/schema";
import { auth, db } from "@/lib/auth";
import { encrypt } from "@/utlis/encrypt";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const PROVIDER_CONFIG = {
  gmail: {
    key: process.env.GOOGLE_CLIENT_ID || "",
    secret: process.env.GOOGLE_CLIENT_SECRET || "",
    access_url: "https://oauth2.googleapis.com/token",
    endpoint: "https://www.googleapis.com/oauth2/v2/userinfo",
    callback: "/api/oauth/gmail/callback",
    headers: (token: string) => ({ Authorization: `Bearer ${token}` }),
    extractAccountName: (data: any) => data.email ?? "Google Account",
    extractUserInfo: (data: any) => data,
  },
  sheets: {
    key: process.env.GOOGLE_CLIENT_ID || "",
    secret: process.env.GOOGLE_CLIENT_SECRET || "",
    access_url: "https://oauth2.googleapis.com/token",
    endpoint: "https://www.googleapis.com/oauth2/v2/userinfo",
    callback: "/api/oauth/sheets/callback",
    headers: (token: string) => ({ Authorization: `Bearer ${token}` }),
    extractAccountName: (data: any) => data.email ?? "Google Account",
    extractUserInfo: (data: any) => data,
  },
  slack: {
    key: process.env.SLACK_CLIENT_ID || "",
    secret: process.env.SLACK_CLIENT_SECRET || "",
    access_url: "https://slack.com/api/oauth.v2.access",
    endpoint: "https://slack.com/api/users.identify",
    callback: "/api/oauth/slack/callback",
    headers: (token: string) => ({}),
    extractAccountName: (data: any) => data.email ?? "Slack Workspace",
    extractUserInfo: (data: any) => data,
    userTokenUrl: true,
  },
  discord: {
    key: process.env.DISCORD_CLIENT_ID || "",
    secret: process.env.DISCORD_CLIENT_SECRET || "",
    access_url: "https://discord.com/api/oauth2/token",
    endpoint: "https://discord.com/api/users/@me",
    callback: "/api/oauth/discord/callback",
    headers: (token: string) => ({ Authorization: `Bearer ${token}` }),
    extractAccountName: (data: any) =>
      data.username
        ? `${data.username}#${data.discriminator || "0000"}`
        : "Discord User",
    extractUserInfo: (data: any) => data,
  },
  notion: {
    key: process.env.NOTION_CLIENT_ID || "",
    secret: process.env.NOTION_CLIENT_SECRET || "",
    access_url: "https://api.notion.com/v1/oauth/token",
    endpoint: "https://api.notion.com/v1/users/me",
    callback: "/api/oauth/notion/callback",
    headers: (token: string) => ({
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "content-type": "application/json",
    }),
    extractAccountName: (data: any) =>
      data.person?.email ?? data.name ?? "Notion User",
    extractUserInfo: (data: any) => data,
  },
  stripe: {
    key: process.env.STRIPE_CLIENT_ID || "",
    secret: process.env.STRIPE_CLIENT_SECRET || "",
    access_url: "https://connect.stripe.com/oauth/token",
    callback: "/api/oauth/stripe/callback",
    isSpecial: true,
    extractAccountName: (token: any) =>
      token.stripe_user_id ?? "Stripe Account",
    extractUserInfo: (token: any) => ({
      stripe_user_id: token.stripe_user_id,
    }),
  },
} as const;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { provider } = await params;
  const providerKey = provider as keyof typeof PROVIDER_CONFIG;
  const cfg = PROVIDER_CONFIG[providerKey];

  if (!cfg) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 404 });
  }
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  let returnUrl = null;

  if (state) {
    try {
      const stateData = JSON.parse(atob(state));
      returnUrl = stateData.returnUrl;
    } catch (error) {
      console.error("Error parsing state:", error);
    }
  }
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const tokenRes = await fetch(cfg.access_url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: cfg.key,
        client_secret: cfg.secret,
        redirect_uri: appUrl + cfg.callback,
      }),
    });
    if(!tokenRes.ok){
        console.log("Token exchange failed", await tokenRes.text());
        return NextResponse.json({error: "Token exchange failed"},{status:400});
    }
    const tokens = await tokenRes.json();
    console.log("Received tokens", tokens);
    
    if(!tokens.access_token){
        console.log("No access token in the response:",tokens);

        return NextResponse.json(
            {error: "No access token received"},
            {status: 400}
        );
    }
    const {accountName, userInfo} = await deriveAccountName(provider,tokens);
    const encryptedAccessToken = encrypt(tokens.access_token);

    const encryptedRefreshToken = tokens.refresh_token ? encrypt(tokens.refresh_token): null;
    const iv = Buffer.from(encryptedAccessToken.split(":")[0],"hex");

    const existingConnection = await db
    .select()
    .from(connections)
    .where(
        and(
            eq(connections.user_id, session?.user.id), 
            eq(connections.platform, provider), 
            eq(connections.account_name, accountName), 
        )
    )
    .limit(1);

    if(existingConnection.length >0){
        const updatedData: any = {
            access_token_enc: Buffer.from(encryptedAccessToken, "utf8"),
            iv,
            metadata: {raw: tokens,...userInfo},
            updated_at: sql`now()`,
        };
    }
  } catch (error) {}
}

async function deriveAccountName(provider:string, tokens:any) {
    try {
        const config:any = PROVIDER_CONFIG[provider as keyof typeof PROVIDER_CONFIG];
        if(!config){
            console.warn(`no configuration fond for provider:${provider}`);
            return {accountName: "Connected Account", userInfo: null};   
        }
        if(config.isSpecial && provider === "stripe"){
            return{
                accountName: config.extractAccountName(tokens),
                userInfo: config.extractUserInfo(tokens),
            };
        }
        if(!config.isSpecial){
            const endpoint = config.userTokenInUrl ? `${config.endpoint}?token=${tokens.access_token}`: config.endpoint;

            const response = await fetch(endpoint,{
                headers: config.headers(tokens.access_token),
            });
        if(!response.ok){
            console.error(`Failed to fetch user info from ${provider}:`, await response.text());
            return {accountName: "Connected Account", userInfo: null};
        }
        const userData = await response.json();
        return{
            accountName: config.extractAccountName(userData),
            userInfo: config.extractUserInfo(userData),
        };
        }
    } catch (error) {
        console.error(`Error deriving account name for ${provider}:`, error);
    }
    return {accountName: "Connected Account", userInfo: null};
}
