"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import { InfoDialog } from "./InfoDialog";
import { SizeGuideContent } from "./SizeGuideContent";
import { SizeSelector } from "./SizeSelector";
import { WishlistToggleButton } from "./WishlistToggleButton";
import type { Product } from "@/lib/website/products";
import { effectivePriceRupees } from "@/lib/website/pricing";

/**
 * One client island covering everything on the product page that needs
 * shared state or interaction: size selection, the delivery method note,
 * Add to Cart (which validates size selection), and the wishlist toggle.
 * Everything above this (gallery, price, description, accordion) stays
 * server-rendered in the page itself.
 */
export function ProductActions({ product, sizes }: { product: Product; sizes: string[] }) {
  const { addItem, open } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    if (sizes.length > 0 && !selectedSize) {
      setError("Please select a size.");
      return;
    }
    setError(null);
    addItem({
      slug: product.slug,
      name: product.name,
      image: product.image.src,
      category: product.category,
      unitPriceRupees: effectivePriceRupees(product),
      colorName: product.colorName,
      size: selectedSize,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    open();
  }

  return (
    <>
      {sizes.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <p className="u-caps text-muted">Size</p>
            <InfoDialog
              trigger="View Size Guide"
              triggerClassName="text-muted hover:text-brass-deep text-sm underline underline-offset-2"
              title="Size Guide"
            >
              <SizeGuideContent />
            </InfoDialog>
          </div>
          <div className="mt-3">
            <SizeSelector
              sizes={sizes}
              selected={selectedSize}
              onSelect={(size) => {
                setSelectedSize(size);
                setError(null);
              }}
            />
          </div>
          {error && <p className="text-rust mt-2 text-sm">{error}</p>}
        </div>
      )}

      <div className="mt-8">
        <p className="u-caps text-muted">Delivery Method</p>
        <div className="mt-3 flex gap-6">
          <span className="inline-flex items-center gap-2 text-sm">
            <span className="border-brass-deep flex h-4 w-4 items-center justify-center rounded-full border-2">
              <span className="bg-brass-deep h-2 w-2 rounded-full" />
            </span>
            Home Delivery
          </span>
          <span className="text-muted/50 inline-flex items-center gap-2 text-sm">
            <span className="border-line h-4 w-4 rounded-full border-2" />
            Store Pick-up (not yet available)
          </span>
        </div>
      </div>

      <div className="mt-9 flex items-center gap-3">
        <button type="button" onClick={handleAddToCart} className="u-btn u-caps flex-1">
          {added ? "Added ✓" : "Add to Cart"}
        </button>
        <WishlistToggleButton
          product={{
            slug: product.slug,
            name: product.name,
            image: product.image.src,
            category: product.category,
            priceRupees: product.priceRupees,
            salePriceRupees: product.salePriceRupees,
            colorName: product.colorName,
          }}
          className="border-line hover:border-brass flex h-[2.75rem] w-[2.75rem] shrink-0 items-center justify-center border transition-colors"
          iconClassName="h-[18px] w-[18px]"
        />
      </div>
    </>
  );
}
