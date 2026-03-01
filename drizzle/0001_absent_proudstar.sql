CREATE TABLE "connections" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"platform" text NOT NULL,
	"account_name" text NOT NULL,
	"metadata" json,
	"access_token_enc" "bytea",
	"refresh_token_enc" "bytea",
	"iv" "bytea" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"plan" text DEFAULT 'free' NOT NULL,
	"usage_limit" integer DEFAULT 1000 NOT NULL,
	"usage" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
