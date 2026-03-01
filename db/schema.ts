import { sql } from "drizzle-orm";
import { customType, integer, json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const bytea = customType<{data: Buffer; notNull: false; default: false}>({
  dataType(){
    return "bytea";
  },
  toDriver(val: unknown){
    return val as Buffer;
  },
  fromDriver(val: unknown) {
    return val as Buffer;
  },
})

export const connections = pgTable("connections", {
  id: uuid("id").primaryKey(),
  user_id: text("user_id").notNull(),
  platform: text("platform").notNull(),
  account_name: text("account_name").notNull(),
  metadata: json("metadata"),
  access_token_enc: bytea("access_token_enc"),  
  refresh_token_enc: bytea("refresh_token_enc"),
  iv: bytea("iv").notNull(),
  created_at: timestamp("created_at",{withTimezone: true}).default(sql`now()`),
  updated_at: timestamp("updated_at",{withTimezone: true}).default(sql`now()`),
})

export const usage = pgTable("usage", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: text("user_id").notNull(),
  plan: text("plan").notNull().default("free"),
  usage_limit: integer("usage_limit").notNull().default(1000),
  usage: integer("usage").notNull().default(0),
  created_at: timestamp("created_at", {withTimezone: true}).default(sql`now()`),
  updated_at: timestamp("updated_at", {withTimezone: true}).default(sql`now()`),
})