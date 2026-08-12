/**
 * The four collections. Fixed — adding a fifth means adding it here *and*
 * to the CHECK constraint in supabase/setup.sql.
 */
export const CATEGORIES = [
  { slug: "sherwani", label: "Sherwani" },
  { slug: "waistcoat", label: "Waistcoat" },
  { slug: "prince-coat", label: "Prince Coat" },
  { slug: "suit", label: "Suit" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function isCategorySlug(value: unknown): value is CategorySlug {
  return CATEGORIES.some((c) => c.slug === value);
}

export function categoryLabel(slug: CategorySlug): string {
  return CATEGORIES.find((c) => c.slug === slug)!.label;
}
