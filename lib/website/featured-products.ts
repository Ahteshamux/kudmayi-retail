import { GROOM_EDIT_LIMIT } from "./constants";
import { listAllProducts, type Product } from "./products";

/**
 * "The Groom Edit" — driven by the admin's "Featured (Groom Edit)" toggle
 * (`featured` on storefront_products), not a hardcoded slug list.
 *
 * Order: pieces given a fixed position (1–8) take that slot; "Auto" pieces
 * fill the remaining slots, newest first. Falling back to the newest pieces
 * when nothing is flagged keeps the rail populated on a fresh catalogue, so
 * the homepage never ships a blank section while the shop is being set up.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await listAllProducts(); // newest first
  const flagged = all.filter((p) => p.featured);
  if (flagged.length === 0) return all.slice(0, GROOM_EDIT_LIMIT);

  const slots: (Product | undefined)[] = new Array(GROOM_EDIT_LIMIT);
  const auto: Product[] = [];
  for (const product of flagged) {
    const pos = product.featuredPosition;
    if (pos && pos >= 1 && pos <= GROOM_EDIT_LIMIT && !slots[pos - 1]) {
      slots[pos - 1] = product;
    } else {
      auto.push(product);
    }
  }
  for (let i = 0; i < GROOM_EDIT_LIMIT && auto.length > 0; i++) {
    if (!slots[i]) slots[i] = auto.shift();
  }
  return slots.filter((p): p is Product => Boolean(p));
}
