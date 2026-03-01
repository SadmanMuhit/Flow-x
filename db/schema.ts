import { pgTable, text, uuid } from "drizzle-orm/pg-core";


export const connections = pgTable("connections", {
  id: uuid("id").primaryKey(),
  user_id: text("user_id").notNull(),
  platform: text("platform").notNull(),
})