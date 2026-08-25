import { listAllProducts, type Product } from "./products";

/**
 * "The Groom Edit" — a curated slice of the main catalog, not a separate
 * dataset. Once real products exist in the database, swap this fixed slug
 * list for a real `featured` flag/query (the schema already has a
 * `featured` column ready for that — see lib/db/schema.ts).
 */
const GROOM_EDIT_SLUGS = [
  "ivory-embroidered-sherwani",
  "black-velvet-prince-coat",
  "cream-silk-kurta",
  "charcoal-bandhgala",
  "deep-brown-waistcoat",
  "slate-grey-three-piece-suit",
];

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await listAllProducts();
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  return GROOM_EDIT_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (p): p is Product => p !== undefined,
  );
}
