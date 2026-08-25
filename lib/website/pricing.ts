import type { Product } from "./products";

/**
 * The price a shopper actually pays — the sale price when the piece is
 * discounted, otherwise the regular price. Shared by the cart, the
 * wishlist, and the shop listing's price filter so "price" means the same
 * thing everywhere.
 *
 * Deliberately its own file, not part of lib/website/products.ts — that
 * module imports lib/db/client.ts (Drizzle + the `postgres` package,
 * Node-only), so any Client Component importing so much as a helper
 * function from it pulls `postgres` into the browser bundle and fails to
 * build. This file has no server-only imports, so Client Components can
 * import it safely.
 */
export function effectivePriceRupees(
  product: Pick<Product, "priceRupees" | "salePriceRupees">,
): number {
  return product.salePriceRupees ?? product.priceRupees;
}
