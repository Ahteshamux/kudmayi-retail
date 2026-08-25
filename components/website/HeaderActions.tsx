"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { BagIcon, HeartIcon, SearchIcon } from "./icons";

/** Bag icon + live item count, opens the cart drawer via CartContext. */
export function CartHeaderButton() {
  const { count, open } = useCart();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      className="inline-flex items-center gap-1"
    >
      <BagIcon />
      <span className="u-caps">{count}</span>
    </button>
  );
}

/** Heart icon + live saved count, links to the wishlist page. */
export function WishlistHeaderLink() {
  const { count } = useWishlist();
  return (
    <Link href="/wishlist" aria-label={`Wishlist, ${count} item${count === 1 ? "" : "s"}`} className="relative">
      <HeartIcon filled={count > 0} className={`h-[18px] w-[18px] ${count > 0 ? "text-rust" : ""}`} />
      {count > 0 && (
        <span className="bg-brass-deep text-parchment absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[0.5rem]">
          {count}
        </span>
      )}
    </Link>
  );
}

/**
 * Search icon that opens a small dropdown panel with a plain GET form —
 * submitting navigates to /search?q=..., no client-side fetch needed. The
 * panel closes on outside click or Escape.
 */
export function SearchTrigger() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-label="Search" aria-expanded={open}>
        <SearchIcon />
      </button>

      {open && (
        <form
          action="/search"
          method="get"
          className="bg-parchment border-line absolute top-full right-0 z-20 mt-3 flex w-72 items-center gap-2 border p-3 shadow-[0_8px_24px_rgba(23,20,16,0.15)]"
        >
          <input
            type="search"
            name="q"
            autoFocus
            placeholder="Search products…"
            className="u-field"
            aria-label="Search products"
          />
          <button type="submit" className="u-caps text-brass-deep shrink-0">
            Go
          </button>
        </form>
      )}
    </div>
  );
}
