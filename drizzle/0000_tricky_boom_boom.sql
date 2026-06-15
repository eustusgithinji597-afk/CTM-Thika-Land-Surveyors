CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted');--> statement-breakpoint
CREATE TYPE "public"."property_status" AS ENUM('available', 'sold');--> statement-breakpoint
CREATE TYPE "public"."service_type" AS ENUM('survey', 'plot_booking', 'mutation_forms');--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"service_type" "service_type" NOT NULL,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"location" text NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"image_url" text,
	"status" "property_status" DEFAULT 'available' NOT NULL,
	"amenities" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
