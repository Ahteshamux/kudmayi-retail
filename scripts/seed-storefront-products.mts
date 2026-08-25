/**
 * One-time (or re-runnable) seed: loads the 40 placeholder products into
 * the real storefront_products/storefront_product_images tables, using
 * their existing Unsplash URLs as the initial "images" — no re-upload
 * needed. Run once DATABASE_URL is set and supabase/storefront-setup.sql
 * has been run:
 *
 *   npm run seed-storefront
 *
 * Safe to run more than once — existing rows (matched by slug) are
 * updated in place rather than duplicated. Replace any product's photos
 * with real ones any time afterwards through /admin/products; this seed
 * never overwrites images on a product that already has some.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// Node doesn't auto-load .env.local outside of Next's own dev/build/start
// — do it by hand so DATABASE_URL is available before lib/db/client runs.
const envPath = resolve(import.meta.dirname, "../.env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (match && !(match[1] in process.env)) {
      process.env[match[1]] = match[2];
    }
  }
}

const { getDb } = await import("../lib/db/client");
const { storefrontProducts, storefrontProductImages } = await import("../lib/db/schema");
const { PLACEHOLDER_PRODUCTS } = await import("../lib/website/products");
const { eq } = await import("drizzle-orm");

async function main() {
  const db = getDb();
  if (!db) {
    console.error(
      "DATABASE_URL isn't set (or still holds the placeholder value) in .env.local — nothing to seed against.",
    );
    process.exit(1);
  }

  let created = 0;
  let updated = 0;

  for (const product of PLACEHOLDER_PRODUCTS) {
    const existing = await db.query.storefrontProducts.findFirst({
      where: eq(storefrontProducts.slug, product.slug),
    });

    const values = {
      slug: product.slug,
      name: product.name,
      category: product.category,
      priceRupees: product.priceRupees,
      readyToShip: product.readyToShip,
      colorName: product.colorName,
      colorHex: product.colorHex,
      description: product.description,
      sizes: product.sizes,
      featured: false,
      updatedAt: new Date(),
    };

    if (existing) {
      await db
        .update(storefrontProducts)
        .set(values)
        .where(eq(storefrontProducts.id, existing.id));
      updated++;
      continue;
    }

    const [row] = await db.insert(storefrontProducts).values(values).returning();
    await db.insert(storefrontProductImages).values([
      {
        productId: row.id,
        storagePath: product.image.src,
        publicUrl: product.image.src,
        altText: product.image.alt,
        sortOrder: 0,
      },
      {
        productId: row.id,
        storagePath: product.hoverImage.src,
        publicUrl: product.hoverImage.src,
        altText: product.hoverImage.alt,
        sortOrder: 1,
      },
    ]);
    created++;
  }

  console.log(`Seed complete — ${created} created, ${updated} updated.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
