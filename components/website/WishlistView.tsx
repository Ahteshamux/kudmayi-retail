"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { WishlistToggleButton } from "./WishlistToggleButton";
import { formatPKR } from "@/lib/website/format";

/** Client-rendered — wishlist data lives only in this browser's
 *  localStorage (see WishlistContext), so there's nothing to fetch on the
 *  server for this page. */
export function WishlistView() {
  const { items } = useWishlist();
  const { addItem, open } = useCart();

  if (items.length === 0) {
    return (
      <div className="mt-10">
        <p className="text-muted">
          Nothing saved yet. Tap the heart on any piece to save it here.
        </p>
        <Link href="/shop/sherwanis" className="u-btn u-caps mt-6 inline-flex">
          Start Browsing
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
      {items.map((item) => {
        const price = item.salePriceRupees ?? item.priceRupees;
        return (
          <div key={item.slug} className="group relative">
            <Link href={`/product/${item.slug}`} className="block">
              <div className="bg-well relative aspect-[3/4] overflow-hidden">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 23vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="mt-3.5 space-y-1.5">
                <h3 className="font-display text-[0.95rem] leading-snug">{item.name}</h3>
                <p className="text-sm">{formatPKR(price)}</p>
              </div>
            </Link>

            <WishlistToggleButton
              product={item}
              className="text-espresso bg-parchment/80 hover:bg-parchment absolute top-3 right-3 z-10 rounded-full p-1.5 transition-colors"
            />

            <button
              type="button"
              onClick={() => {
                addItem({
                  slug: item.slug,
                  name: item.name,
                  image: item.image,
                  category: item.category,
                  unitPriceRupees: price,
                  colorName: item.colorName,
                  size: null,
                });
                open();
              }}
              className="u-caps text-brass-deep mt-2 text-[0.6875rem] hover:underline"
            >
              Add to Cart
            </button>
          </div>
        );
      })}
    </div>
  );
}
