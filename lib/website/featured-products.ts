import { listAllProducts, type Product } from "./products";

/** How many pieces the homepage rail shows. */
const GROOM_EDIT_LIMIT = 6;

/**
 * "The Groom Edit" — driven by the admin's "Featured (Groom Edit)" toggle
 * (`featured` on storefront_products), not a hardcoded slug list.
 *
 * It used to be a fixed list of six *placeholder* slugs. That had two
 * faults: the admin toggle was saved but silently ignored, and — worse —
 * once real products replaced the placeholders none of those slugs would
 * resolve, so the homepage's featured rail would quietly render empty.
 *
 * Falling back to the newest pieces when nothing is flagged keeps the rail
 * populated on a fresh catalogue, so the homepage never ships a blank
 * section while the shop is still being set up.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await listAllProducts();
  const flagged = all.filter((p) => p.featured);
  const chosen = flagged.length > 0 ? flagged : all;
  return chosen.slice(0, GROOM_EDIT_LIMIT);
}
