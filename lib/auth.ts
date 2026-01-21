import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { neon} from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as authShema from "@/db/auth-schema";
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
    }
});