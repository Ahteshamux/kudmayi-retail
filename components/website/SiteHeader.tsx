import Link from "next/link";
import { CartHeaderButton, SearchTrigger, WishlistHeaderLink } from "./HeaderActions";
import { MobileNav } from "./MobileNav";
import { PrimaryNav } from "./PrimaryNav";

/**
 * Header — a main row (ship-to left, logo centered, search/wishlist/cart
 * icons right; no Account icon, since there's no customer login system)
 * with the mega-menu nav row beneath it on desktop, and a compact
 * MENU · KUDMAYI · search · cart row on mobile.
 *
 * Renders a fragment, not its own <header>: HeaderScrollBoundary (which
 * renders this) already provides the <header> landmark, and nesting a
 * second one inside it would declare two banner landmarks for one header.
 *
 * The scroll hide/reveal lives in that boundary. The nav (PrimaryNav), the
 * drawer (MobileNav), and the icons (HeaderActions) are client islands so
 * they can hold open/close state and read live cart/wishlist counts — this
 * file itself needs no "use client".
 *
 * Mobile deliberately carries fewer icons than desktop: wishlist, and
 * search as a full-width field, live inside the drawer instead, so the top
 * row never crowds a 375px-wide screen.
 */
export function SiteHeader() {
  return (
    <>
      {/* Desktop / tablet */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between gap-8 px-8 py-3.5">
          {/* Single market (Pakistan, PKR) — plain text, not a dropdown
              with nothing to select. */}
          <span className="u-caps opacity-70">Ship to: Pakistan (PKR)</span>

          <Link href="/" className="shrink-0">
            <span className="font-display text-2xl tracking-[0.3em] uppercase">
              Kudmayi
            </span>
          </Link>

          <div className="flex items-center gap-5">
            <SearchTrigger />
            <WishlistHeaderLink />
            <CartHeaderButton />
          </div>
        </div>

        <PrimaryNav />
      </div>

      {/* Mobile: MENU · KUDMAYI · SEARCH/CART */}
      <div className="flex items-center justify-between px-5 py-3 md:hidden">
        <MobileNav />
        <Link href="/" className="shrink-0">
          <span className="font-display text-lg tracking-[0.28em] uppercase">
            Kudmayi
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <SearchTrigger />
          <CartHeaderButton />
        </div>
      </div>
    </>
  );
}
