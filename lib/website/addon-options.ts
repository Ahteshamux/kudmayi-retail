import { asc, eq } from "drizzle-orm";
import type { AddonOption } from "@/components/admin/ProductForm";
import { getDb } from "@/lib/db/client";
import { storefrontProductAddons, storefrontProducts } from "@/lib/db/schema";

/**
 * Every product, for the admin's two pickers: "Complete the look" (on a
 * garment — only the add-on categories are shown) and "Goes with" (on an
 * add-on piece — every category is shown).
 */
export async function loadAddonOptions(): Promise<AddonOption[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db.query.storefrontProducts.findMany({
    with: { images: { orderBy: (i, { asc }) => [asc(i.sortOrder)], limit: 1 } },
    orderBy: [asc(storefrontProducts.name)],
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    image: r.images[0]?.publicUrl ?? null,
    priceRupees: r.priceRupees,
    published: r.published,
  }));
}

/** The add-ons offered on this product's page. */
export async function loadSelectedAddonIds(productId: string): Promise<string[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select({ id: storefrontProductAddons.addonProductId })
    .from(storefrontProductAddons)
    .where(eq(storefrontProductAddons.productId, productId));
  return rows.map((r) => r.id);
}

/** The products whose pages offer this piece as an add-on. */
export async function loadPairedWithIds(addonProductId: string): Promise<string[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select({ id: storefrontProductAddons.productId })
    .from(storefrontProductAddons)
    .where(eq(storefrontProductAddons.addonProductId, addonProductId));
  return rows.map((r) => r.id);
}
