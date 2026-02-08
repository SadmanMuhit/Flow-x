import { pgTable, text, boolean, serial } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  isVerified: boolean("isVerified").default(false),
  verificationToken: text("verificationToken"),
});