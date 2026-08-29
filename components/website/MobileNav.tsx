"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useWishlist } from "./WishlistContext";
import { SHOP_CATEGORIES } from "@/lib/website/categories";
import { SECONDARY_MOBILE_LINKS } from "@/lib/website/nav";
import { whatsAppLink } from "@/lib/website/whatsapp";
import { useFocusTrap } from "./useFocusTrap";

/**
 * MENU trigger + full-screen drawer, mobile only — where most of this
 * site's traffic actually navigates, so it carries the full journey rather
 * than a flat link list: search, the five categories as large tap targets,
 * secondary links, wishlist, and a WhatsApp CTA.
 *
 * The header row stays uncluttered (MENU · KUDMAYI · search · cart) with
 * wishlist living in here, so nothing crowds a 375px-wide screen. The
 * scroll area is its own flex child, so the header/footer of the drawer
 * stay put while only the links scroll, and it pads for the home indicator
 * on notched phones.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { count } = useWishlist();
  const trapRef = useFocusTrap<HTMLDivElement>(open);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className="u-caps"
      >
        Menu
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          ref={trapRef}
          tabIndex={-1}
          className="bg-parchment u-panel-in fixed inset-0 z-50 flex flex-col"
        >
          <div className="border-line flex shrink-0 items-center justify-between border-b px-5 py-4">
            <span className="font-display text-lg tracking-[0.28em] uppercase">
              Kudmayi
            </span>
            <button type="button" onClick={close} aria-label="Close menu" className="u-caps">
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <form action="/search" method="get" onSubmit={close} className="flex gap-2">
              <input
                type="search"
                name="q"
                placeholder="Search products…"
                aria-label="Search products"
                className="u-field"
              />
              <button type="submit" className="u-btn u-caps shrink-0">
                Go
              </button>
            </form>

            <nav aria-label="Shop by category" className="mt-8">
              <p className="u-caps text-brass-deep">Shop</p>
              <ul className="mt-3">
                {SHOP_CATEGORIES.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/shop/${category.slug}`}
                      onClick={close}
                      className="font-display border-line hover:text-brass-deep block border-b py-4 text-2xl transition-colors"
                    >
                      {category.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="More" className="mt-8">
              <ul className="space-y-4">
                {SECONDARY_MOBILE_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={close}
                      className="text-muted hover:text-brass-deep text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/wishlist"
                    onClick={close}
                    className="text-muted hover:text-brass-deep text-sm transition-colors"
                  >
                    Wishlist{count > 0 ? ` (${count})` : ""}
                  </Link>
                </li>
              </ul>
            </nav>

            <a
              href={whatsAppLink("Hi Kudmayi, I'd like to know more.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="u-btn u-caps mt-8 w-full"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
}
