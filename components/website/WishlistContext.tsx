"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { createLocalStore } from "@/lib/website/local-store";

export type WishlistItem = {
  slug: string;
  name: string;
  image: string;
  category: string;
  priceRupees: number;
  salePriceRupees: number | null;
  colorName: string;
};

type WishlistContextValue = {
  items: WishlistItem[];
  has: (slug: string) => boolean;
  toggle: (item: WishlistItem) => void;
  remove: (slug: string) => void;
  clear: () => void;
  count: number;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = "kudmayi:wishlist:v1";
const wishlistStore = createLocalStore<WishlistItem[]>(STORAGE_KEY, []);

/** Same localStorage-only model as CartContext — no accounts, so no
 *  wishlist synced across devices. See CartContext's and
 *  lib/website/local-store.ts's doc comments. */
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(
    wishlistStore.subscribe,
    wishlistStore.getSnapshot,
    wishlistStore.getServerSnapshot,
  );

  const has = useCallback((slug: string) => items.some((i) => i.slug === slug), [items]);

  const toggle = useCallback((item: WishlistItem) => {
    const prev = wishlistStore.getSnapshot();
    wishlistStore.set(
      prev.some((i) => i.slug === item.slug)
        ? prev.filter((i) => i.slug !== item.slug)
        : [...prev, item],
    );
  }, []);

  const remove = useCallback((slug: string) => {
    wishlistStore.set(wishlistStore.getSnapshot().filter((i) => i.slug !== slug));
  }, []);

  const clear = useCallback(() => wishlistStore.set([]), []);

  const value = useMemo<WishlistContextValue>(
    () => ({ items, has, toggle, remove, clear, count: items.length }),
    [items, has, toggle, remove, clear],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
