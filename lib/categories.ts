/**
 * The collections a piece can be saved under. Fixed — adding one means adding
 * it here *and* to the CHECK constraint in supabase/setup.sql.
 */
export const CATEGORIES = [
  { slug: "sherwani", label: "Sherwani" },
  { slug: "waistcoat", label: "Waistcoat" },
  { slug: "prince-coat", label: "Prince Coat" },
  { slug: "suit", label: "Suit" },
  { slug: "sarbala", label: "Sarbala" },
  { slug: "turbans", label: "Turbans" },
  { slug: "groom-footwear", label: "Groom Footwear" },
] as const;

/** Grouped behind one "Accessories" button on the Retail home screen. */
export const ACCESSORY_SLUGS: readonly string[] = ["turbans", "groom-footwear"];
export const RETAIL_ACCESSORIES_HREF = "/admin/catalog/category/accessories";

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function isCategorySlug(value: unknown): value is CategorySlug {
  return CATEGORIES.some((c) => c.slug === value);
}

export function categoryLabel(slug: CategorySlug): string {
  return CATEGORIES.find((c) => c.slug === slug)!.label;
}
