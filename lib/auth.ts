import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { neon} from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as authShema from "@/db/auth-schema";
import { request } from "http";
import {nextCookies} from "better-auth/next-js";
import { EmailService } from "@/services/emailService";
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql); 
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema:{
            user: authShema.user,
            session: authShema.session,
            account: authShema.account,
        }
    }),
    secret: process.env.BETTER_AUTH_SECRET!,
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    emailVerification:{
        sendVerificationEmail: async ({user, url,token},request) =>{
            const finalURL =(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000") + url;

            await EmailService.sendVerificationEmail({
                to: user.email,
                name: user.name,
                url: finalURL,
            });
        },
    },
    password: {minLength: 8,bcryptRounds: 12},
    sessions: {cookieName: "fx_session", cookieSecure: true, ttl: 60 * 60 * 24 * 30},
    plugins: [nextCookies()],
});