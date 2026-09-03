"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { createLocalStore } from "@/lib/website/local-store";

export type DeliveryMethod = "home" | "store";

export type CartItem = {
  /** slug + colour + size, so the same garment in a different size is a
   *  separate line — not a real product identity, just a cart row key. */
  key: string;
  slug: string;
  name: string;
  image: string;
  category: string;
  unitPriceRupees: number;
  colorName: string;
  size: string | null;
  /** Optional only for carts saved before delivery selection was introduced. */
  deliveryMethod?: DeliveryMethod;
  qty: number;
};

type NewCartItem = Omit<CartItem, "qty" | "key" | "deliveryMethod"> & {
  deliveryMethod: DeliveryMethod;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (item: NewCartItem, qty?: number) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotalRupees: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "kudmayi:cart:v1";
const cartStore = createLocalStore<CartItem[]>(STORAGE_KEY, []);

function makeKey(
  slug: string,
  colorName: string,
  size: string | null,
  deliveryMethod: DeliveryMethod,
) {
  return [slug, colorName, size ?? "", deliveryMethod].join("::");
}

/**
 * Cart state lives in localStorage, not a database — there are no customer
 * accounts (see lib/website/whatsapp.ts and the header's dropped Account
 * icon), so a per-browser cart that hands off to a WhatsApp order at
 * checkout is the whole model. See lib/website/local-store.ts for why this
 * reads via useSyncExternalStore rather than a hydration effect.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((item: NewCartItem, qty = 1) => {
    const key = makeKey(item.slug, item.colorName, item.size, item.deliveryMethod);
    const prev = cartStore.getSnapshot();
    const existing = prev.find((i) => i.key === key);
    const next = existing
      ? prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
      : [...prev, { ...item, key, qty }];
    cartStore.set(next);
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((key: string) => {
    cartStore.set(cartStore.getSnapshot().filter((i) => i.key !== key));
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    const prev = cartStore.getSnapshot();
    cartStore.set(
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty } : i)),
    );
  }, []);

  const clear = useCallback(() => cartStore.set([]), []);

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const subtotalRupees = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPriceRupees * i.qty, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      addItem,
      removeItem,
      updateQty,
      clear,
      count,
      subtotalRupees,
    }),
    [items, isOpen, addItem, removeItem, updateQty, clear, count, subtotalRupees],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
