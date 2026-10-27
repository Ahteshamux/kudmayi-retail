import { and, eq, isNotNull } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { storefrontProducts } from "@/lib/db/schema";
import type { GroomEditSlot } from "@/components/admin/ProductForm";

/** Featured pieces holding a fixed Groom Edit slot — for the admin picker. */
export async function loadGroomEditSlots(): Promise<GroomEditSlot[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select({
      position: storefrontProducts.featuredPosition,
      slug: storefrontProducts.slug,
      name: storefrontProducts.name,
    })
    .from(storefrontProducts)
    .where(
      and(
        eq(storefrontProducts.featured, true),
        isNotNull(storefrontProducts.featuredPosition),
      ),
    );
  return rows.map((r) => ({ position: r.position!, slug: r.slug, name: r.name }));
}
