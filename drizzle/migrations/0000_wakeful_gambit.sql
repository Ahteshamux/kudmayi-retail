CREATE TABLE "storefront_product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"storage_path" text NOT NULL,
	"public_url" text NOT NULL,
	"alt_text" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "storefront_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"price_rupees" integer NOT NULL,
	"ready_to_ship" boolean DEFAULT false NOT NULL,
	"color_name" text NOT NULL,
	"color_hex" text NOT NULL,
	"description" text,
	"sizes" text[] DEFAULT '{}' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "storefront_product_images" ADD CONSTRAINT "storefront_product_images_product_id_storefront_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."storefront_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "storefront_product_images_product_idx" ON "storefront_product_images" USING btree ("product_id","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "storefront_products_slug_idx" ON "storefront_products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "storefront_products_category_idx" ON "storefront_products" USING btree ("category","created_at");