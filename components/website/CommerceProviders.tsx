"use client";

import { CartDrawer } from "./CartDrawer";
import { CartProvider } from "./CartContext";
import { WishlistProvider } from "./WishlistContext";

/**
 * Single client boundary for cart + wishlist state, mounted once around
 * the whole website layout so the header's icons, product pages, shop
 * cards, and the cart drawer all share the same state. Keeping this one
 * wrapper (instead of nesting providers at the call site) is what lets
 * SiteHeader and the shop/product pages stay Server Components themselves.
 */
export function CommerceProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
        <CartDrawer />
      </WishlistProvider>
    </CartProvider>
  );
}
