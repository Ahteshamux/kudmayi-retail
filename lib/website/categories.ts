/**
 * The public shop categories — single source of truth for slug, label, and
 * route, used by the mega-menu, the homepage's category section, and the
 * /shop/[category] listing pages. Clothing is what the homepage grid shows;
 * accessories group under /shop/accessories. (Separate from
 * lib/categories.ts, which is the admin catalog's own four-category
 * fixed list for the internal tool — the two are unrelated taxonomies.)
 */
export const CLOTHING_CATEGORIES = [
  { slug: "sherwanis", label: "Sherwanis" },
  { slug: "prince-coats", label: "Prince Coats" },
  { slug: "waistcoats", label: "Waistcoats" },
  { slug: "kurtas", label: "Kurtas" },
  { slug: "suits", label: "Suits" },
] as const;

export const ACCESSORY_CATEGORIES = [
  { slug: "turbans", label: "Turbans" },
  { slug: "groom-footwear", label: "Groom Footwear" },
] as const;

/**
 * The sarbala: the boy who accompanies the groom, usually dressed like him.
 * His own section rather than a clothing tile, so the homepage's five-tile
 * grid (CLOTHING_CATEGORIES) stays as designed.
 */
export const SARBALA_CATEGORY = { slug: "sarbala", label: "Sarbala" } as const;

/** Everything a product can be saved under. Mirrors the CHECK constraint in
 *  supabase/storefront-setup.sql — change both together. */
export const SHOP_CATEGORIES = [
  ...CLOTHING_CATEGORIES,
  SARBALA_CATEGORY,
  ...ACCESSORY_CATEGORIES,
] as const;

/** Categories that can be offered as add-ons on another product's page. */
export const ADDON_CATEGORIES = [SARBALA_CATEGORY, ...ACCESSORY_CATEGORIES] as const;

export const ACCESSORIES_HREF = "/shop/accessories";

export type ShopCategorySlug = (typeof SHOP_CATEGORIES)[number]["slug"];

export function isShopCategorySlug(value: string): value is ShopCategorySlug {
  return SHOP_CATEGORIES.some((c) => c.slug === value);
}

export function isAccessoryCategory(slug: ShopCategorySlug): boolean {
  return ACCESSORY_CATEGORIES.some((c) => c.slug === slug);
}

export function shopCategoryLabel(slug: ShopCategorySlug): string {
  return SHOP_CATEGORIES.find((c) => c.slug === slug)!.label;
}
