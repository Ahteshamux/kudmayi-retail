import type { CategorySlug as RetailCategorySlug } from "@/lib/categories";
import type { ShopCategorySlug } from "./categories";

/**
 * Maps the Retail tool's fixed categories onto the storefront's.
 * Retail has no "kurtas" equivalent — an item in that category can't come
 * from Retail, only be added directly in /admin/products.
 */
const RETAIL_TO_STOREFRONT_CATEGORY: Record<RetailCategorySlug, ShopCategorySlug> = {
  sherwani: "sherwanis",
  "prince-coat": "prince-coats",
  waistcoat: "waistcoats",
  suit: "suits",
  sarbala: "sarbala",
  turbans: "turbans",
  "groom-footwear": "groom-footwear",
};

export function mapRetailCategory(category: RetailCategorySlug): ShopCategorySlug {
  return RETAIL_TO_STOREFRONT_CATEGORY[category];
}
