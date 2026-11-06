import { asc, eq, inArray } from "drizzle-orm";
import type { AddonOption } from "@/components/admin/ProductForm";
import { getDb } from "@/lib/db/client";
import { storefrontProductAddons, storefrontProducts } from "@/lib/db/schema";
import { ADDON_CATEGORIES } from "./categories";

/** Every piece that can be ticked as an add-on — for the admin picker. */
export async function loadAddonOptions(): Promise<AddonOption[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db.query.storefrontProducts.findMany({
    where: inArray(
      storefrontProducts.category,
      ADDON_CATEGORIES.map((c) => c.slug),
    ),
    with: { images: { orderBy: (i, { asc }) => [asc(i.sortOrder)], limit: 1 } },
    orderBy: [asc(storefrontProducts.name)],
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    image: r.images[0]?.publicUrl ?? null,
    priceRupees: r.priceRupees,
  }));
}

export async function loadSelectedAddonIds(productId: string): Promise<string[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select({ id: storefrontProductAddons.addonProductId })
    .from(storefrontProductAddons)
    .where(eq(storefrontProductAddons.productId, productId));
  return rows.map((r) => r.id);
}
