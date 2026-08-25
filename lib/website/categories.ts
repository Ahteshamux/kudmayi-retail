/**
 * The five public shop categories — single source of truth for slug,
 * label, and route, used by the mega-menu, the homepage's category
 * section, and the /shop/[category] listing pages. (Separate from
 * lib/categories.ts, which is the admin catalog's own four-category
 * fixed list for the internal tool — the two are unrelated taxonomies.)
 */
export const SHOP_CATEGORIES = [
  { slug: "sherwanis", label: "Sherwanis" },
  { slug: "prince-coats", label: "Prince Coats" },
  { slug: "waistcoats", label: "Waistcoats" },
  { slug: "kurtas", label: "Kurtas" },
  { slug: "suits", label: "Suits" },
] as const;

export type ShopCategorySlug = (typeof SHOP_CATEGORIES)[number]["slug"];

export function isShopCategorySlug(value: string): value is ShopCategorySlug {
  return SHOP_CATEGORIES.some((c) => c.slug === value);
}

export function shopCategoryLabel(slug: ShopCategorySlug): string {
  return SHOP_CATEGORIES.find((c) => c.slug === slug)!.label;
}
