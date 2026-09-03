import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * The public storefront's real product catalog — separate from the
 * internal catalog tool's `products` table (admin/catalog), which is a
 * different, older 4-category tool with no price/description/sizes.
 *
 * This schema is the TypeScript source of truth for query-building via
 * Drizzle, but the actual database objects (tables, indexes, RLS
 * policies, storage bucket) are provisioned by hand-run SQL in
 * supabase/storefront-setup.sql — the same "paste this into the SQL
 * editor" convention the rest of this project already uses. Changing a
 * column here means changing that file too, the same duality already
 * documented for lib/categories.ts and supabase/setup.sql.
 */
export const storefrontProducts = pgTable(
  "storefront_products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    category: text("category").notNull(), // CHECK constraint in SQL: one of SHOP_CATEGORIES' slugs
    priceRupees: integer("price_rupees").notNull(),
    // Set only when the piece is discounted; null means "not on sale".
    // Always < priceRupees, enforced in app/admin/products/actions.ts.
    salePriceRupees: integer("sale_price_rupees"),
    readyToShip: boolean("ready_to_ship").notNull().default(false),
    storePickup: boolean("store_pickup").notNull().default(false),
    colorName: text("color_name").notNull(),
    colorHex: text("color_hex").notNull(),
    description: text("description"),
    sizes: text("sizes").array().notNull().default([]),
    // Freeform merchandising labels — "New Arrival", "Bestseller" — shown
    // as small badges. Distinct from the Ready to Ship badge.
    tags: text("tags").array().notNull().default([]),
    featured: boolean("featured").notNull().default(false),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("storefront_products_slug_idx").on(table.slug),
    index("storefront_products_category_idx").on(table.category, table.createdAt),
  ],
);

export const storefrontProductImages = pgTable(
  "storefront_product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => storefrontProducts.id, { onDelete: "cascade" }),
    storagePath: text("storage_path").notNull(),
    publicUrl: text("public_url").notNull(),
    altText: text("alt_text").notNull().default(""),
    // Lowest sortOrder is the cover image — no separate isCover flag to
    // keep in sync.
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("storefront_product_images_product_idx").on(table.productId, table.sortOrder),
  ],
);

export const storefrontProductsRelations = relations(storefrontProducts, ({ many }) => ({
  images: many(storefrontProductImages),
}));

export const storefrontProductImagesRelations = relations(
  storefrontProductImages,
  ({ one }) => ({
    product: one(storefrontProducts, {
      fields: [storefrontProductImages.productId],
      references: [storefrontProducts.id],
    }),
  }),
);

export type StorefrontProductRow = typeof storefrontProducts.$inferSelect;
export type NewStorefrontProductRow = typeof storefrontProducts.$inferInsert;
export type StorefrontProductImageRow = typeof storefrontProductImages.$inferSelect;
export type NewStorefrontProductImageRow = typeof storefrontProductImages.$inferInsert;

/**
 * One row per homepage photo slot (hero, each category tile, each
 * editorial section, each collections-strip panel, etc.) — see
 * lib/website/homepage-slots.ts for the full slot list and each slot's
 * fallback image. A slot with no row here just shows its fallback; admin
 * only ever needs to touch the slots it wants to change.
 */
export const homepageImages = pgTable(
  "homepage_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slotKey: text("slot_key").notNull(),
    /*
     * Up to three crops of the same photo. `imageUrl` is the desktop
     * image and the one everything falls back to; tablet and mobile are
     * optional art-direction overrides for the handful of sections whose
     * aspect ratio actually changes between breakpoints (see
     * lib/website/homepage-slots.ts). Alt text is shared — it's the same
     * subject in every crop.
     */
    imageUrl: text("image_url").notNull(),
    imageUrlTablet: text("image_url_tablet"),
    imageUrlMobile: text("image_url_mobile"),
    altText: text("alt_text").notNull().default(""),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("homepage_images_slot_key_idx").on(table.slotKey)],
);

export type HomepageImageRow = typeof homepageImages.$inferSelect;

/**
 * One row per admin-editable homepage text slot (a section heading, so
 * far — see lib/website/homepage-text.ts for the slot list and each
 * slot's fallback copy). Same convention as homepageImages above: a slot
 * with no row here just shows its fallback text.
 */
export const homepageText = pgTable(
  "homepage_text",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slotKey: text("slot_key").notNull(),
    value: text("value").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("homepage_text_slot_key_idx").on(table.slotKey)],
);

export type HomepageTextRow = typeof homepageText.$inferSelect;
