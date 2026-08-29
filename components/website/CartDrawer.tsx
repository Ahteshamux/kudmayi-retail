"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart, type CartItem } from "./CartContext";
import { formatPKR } from "@/lib/website/format";
import { useFocusTrap } from "./useFocusTrap";
import { whatsAppLink } from "@/lib/website/whatsapp";

function orderMessage(items: CartItem[], subtotalRupees: number): string {
  const lines = items.map((item) => {
    const variant = [item.colorName, item.size].filter(Boolean).join(", ");
    return `• ${item.qty} × ${item.name} (${variant}) — ${formatPKR(item.unitPriceRupees * item.qty)}`;
  });
  return [
    "Hi Kudmayi, I'd like to order:",
    "",
    ...lines,
    "",
    `Total: ${formatPKR(subtotalRupees)}`,
  ].join("\n");
}

/**
 * Slide-over cart, mounted once in the website layout so it can open from
 * the header's bag icon or from "Add to Cart" on any product page.
 * Checkout hands off to WhatsApp with the order itemized in the message —
 * there's no payment gateway in this project; see CartContext's doc
 * comment for why.
 */
export function CartDrawer() {
  const { items, isOpen, close, removeItem, updateQty, subtotalRupees } = useCart();
  const trapRef = useFocusTrap<HTMLDivElement>(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Cart">
      <button
        type="button"
        onClick={close}
        aria-label="Close cart"
        className="absolute inset-0 bg-espresso/40"
      />

      <div
        ref={trapRef}
        tabIndex={-1}
        className="bg-parchment relative flex h-full w-full max-w-md flex-col shadow-[-8px_0_24px_rgba(23,20,16,0.15)]"
      >
        <div className="border-line flex items-center justify-between border-b px-5 py-4">
          <h2 className="font-display text-xl">Your Cart</h2>
          <button type="button" onClick={close} aria-label="Close cart" className="u-caps">
            Close
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 text-center">
            <p className="text-muted">Your cart is empty.</p>
            <Link href="/shop/sherwanis" onClick={close} className="u-btn u-caps">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4">
                  <div className="bg-well relative h-24 w-20 shrink-0 overflow-hidden">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="font-display text-sm leading-snug">{item.name}</p>
                    <p className="text-muted mt-1 text-xs">
                      {[item.colorName, item.size].filter(Boolean).join(" · ")}
                    </p>
                    <p className="mt-1 text-sm">{formatPKR(item.unitPriceRupees)}</p>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="border-line inline-flex items-center border">
                        <button
                          type="button"
                          onClick={() => updateQty(item.key, item.qty - 1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="hover:bg-well flex h-7 w-7 items-center justify-center"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.key, item.qty + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="hover:bg-well flex h-7 w-7 items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="text-muted hover:text-rust u-caps text-[0.625rem] transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-line space-y-4 border-t px-5 py-5">
              <div className="flex items-center justify-between">
                <span className="u-caps text-muted">Subtotal</span>
                <span className="text-lg">{formatPKR(subtotalRupees)}</span>
              </div>
              <p className="text-muted text-xs">
                Checkout is completed on WhatsApp — send your order and we&rsquo;ll confirm
                sizing, delivery, and payment with you directly.
              </p>
              <a
                href={whatsAppLink(orderMessage(items, subtotalRupees))}
                target="_blank"
                rel="noopener noreferrer"
                className="u-btn u-caps w-full"
              >
                Checkout on WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
