CREATE TYPE "public"."admin_side" AS ENUM('groom', 'bride');--> statement-breakpoint
CREATE TYPE "public"."rsvp_status" AS ENUM('pending', 'confirmed', 'declined');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text NOT NULL,
	"side" "admin_side" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guest_companions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guest_id" uuid NOT NULL,
	"name" text NOT NULL,
	"status" "rsvp_status" DEFAULT 'pending' NOT NULL,
	"responded_at" timestamp with time zone,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "guest_companions_name_not_empty" CHECK (length(trim("guest_companions"."name")) > 0)
);
--> statement-breakpoint
CREATE TABLE "guests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"owner_side" "admin_side" NOT NULL,
	"token" text NOT NULL,
	"status" "rsvp_status" DEFAULT 'pending' NOT NULL,
	"responded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "guests_name_not_empty" CHECK (length(trim("guests"."name")) > 0)
);
--> statement-breakpoint
CREATE TABLE "wedding_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"name" text NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone,
	"address" text NOT NULL,
	"description" text,
	"notes" text,
	"google_maps_url" text,
	"waze_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"couple_names" text NOT NULL,
	"wedding_date" timestamp with time zone NOT NULL,
	"hero_image_url" text,
	"intro_message" text,
	"final_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "guest_companions" ADD CONSTRAINT "guest_companions_guest_id_guests_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wedding_events" ADD CONSTRAINT "wedding_events_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "admin_users_email_unique" ON "admin_users" USING btree (lower("email"));--> statement-breakpoint
CREATE INDEX "guest_companions_guest_order_idx" ON "guest_companions" USING btree ("guest_id","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "guests_token_unique" ON "guests" USING btree ("token");--> statement-breakpoint
CREATE INDEX "guests_wedding_side_idx" ON "guests" USING btree ("wedding_id","owner_side");--> statement-breakpoint
CREATE INDEX "guests_status_idx" ON "guests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "wedding_events_wedding_order_idx" ON "wedding_events" USING btree ("wedding_id","sort_order");