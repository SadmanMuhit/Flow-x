import type { Config } from 'drizzle-kit';

export default {
    dialect: 'postgresql',
    schema: ["./db/auth-schema.ts"],
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    verbose: true,
    strict: true,
} satisfies Config;