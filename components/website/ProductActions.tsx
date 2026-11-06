"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart, type DeliveryMethod } from "./CartContext";
import { InfoDialog } from "./InfoDialog";
import { hasAdultSizeGuide, sizesForCategory } from "@/lib/website/category-copy";
import { formatPKR } from "@/lib/website/format";
import { SizeGuideContent } from "./SizeGuideContent";
import { SizeSelector } from "./SizeSelector";
import { WishlistToggleButton } from "./WishlistToggleButton";
import type { Product } from "@/lib/website/products";
import { effectivePriceRupees } from "@/lib/website/pricing";
import { GOOGLE_MAPS_URL, STORE_ADDRESS } from "@/lib/website/constants";

/**
 * One client island covering everything on the product page that needs
 * shared state or interaction: size selection, the delivery method note,
 * Add to Cart (which validates size selection), and the wishlist toggle.
 * Everything above this (gallery, price, description, accordion) stays
 * server-rendered in the page itself.
 */
export function ProductActions({
  product,
  sizes,
  addons = [],
}: {
  product: Product;
  sizes: string[];
  /** "Complete the look" pieces. Never pre-ticked: an add-on is a choice. */
  addons?: Product[];
}) {
  const { addItem, open } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("home");
  const [picked, setPicked] = useState<Record<string, { size: string | null }>>({});
  const [addonError, setAddonError] = useState<string | null>(null);

  const pickedAddons = addons.filter((a) => picked[a.slug]);
  const total =
    effectivePriceRupees(product) +
    pickedAddons.reduce((sum, a) => sum + effectivePriceRupees(a), 0);

  function addonSizes(addon: Product) {
    return addon.sizes.length > 0 ? addon.sizes : sizesForCategory(addon.category);
  }

  function handleAddToCart() {
    if (sizes.length > 0 && !selectedSize) {
      setError("Please select a size.");
      return;
    }
    const missing = pickedAddons.find((a) => addonSizes(a).length > 0 && !picked[a.slug].size);
    if (missing) {
      setError(null);
      setAddonError(`Please select a size for ${missing.name}.`);
      return;
    }
    setError(null);
    setAddonError(null);
    for (const addon of pickedAddons) {
      addItem({
        slug: addon.slug,
        name: addon.name,
        image: addon.image.src,
        category: addon.category,
        unitPriceRupees: effectivePriceRupees(addon),
        colorName: addon.colorName,
        size: picked[addon.slug].size,
        // Store pick-up only carries over where this piece allows it.
        deliveryMethod: addon.storePickup ? deliveryMethod : "home",
      });
    }
    addItem({
      slug: product.slug,
      name: product.name,
      image: product.image.src,
      category: product.category,
      unitPriceRupees: effectivePriceRupees(product),
      colorName: product.colorName,
      size: selectedSize,
      deliveryMethod,
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
            {/* The guide is adult garment measurements. */}
            {hasAdultSizeGuide(product.category) && (
              <InfoDialog
                trigger="View Size Guide"
                triggerClassName="text-muted hover:text-brass-deep text-sm underline underline-offset-2"
                title="Size Guide"
              >
                <SizeGuideContent />
              </InfoDialog>
            )}
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

      {addons.length > 0 && (
        <fieldset className="mt-8">
          <legend className="u-caps text-muted">Complete the look</legend>
          <ul className="mt-3 space-y-2">
            {addons.map((addon) => {
              const choice = picked[addon.slug];
              const options = addonSizes(addon);
              return (
                <li
                  key={addon.slug}
                  className={`border transition-colors ${choice ? "border-brass-deep bg-surface" : "border-line"}`}
                >
                  <div className="flex items-center gap-3 p-2.5">
                    <input
                      type="checkbox"
                      id={`addon-${addon.slug}`}
                      checked={Boolean(choice)}
                      onChange={(e) => {
                        setAddonError(null);
                        setPicked((prev) => {
                          const next = { ...prev };
                          if (e.target.checked) next[addon.slug] = { size: null };
                          else delete next[addon.slug];
                          return next;
                        });
                      }}
                      className="accent-brass h-5 w-5 shrink-0"
                    />
                    <label htmlFor={`addon-${addon.slug}`} className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                      <span className="bg-well relative h-16 w-12 shrink-0 overflow-hidden">
                        {addon.image.src && (
                          <Image src={addon.image.src} alt="" fill sizes="48px" className="object-cover" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{addon.name}</span>
                        <span className="text-muted block text-sm">
                          + {formatPKR(effectivePriceRupees(addon))}
                        </span>
                      </span>
                    </label>
                    <Link
                      href={`/product/${addon.slug}`}
                      className="text-muted hover:text-brass-deep shrink-0 px-1 py-2 text-xs underline underline-offset-2"
                    >
                      View
                    </Link>
                  </div>
                  {choice && options.length > 0 && (
                    <div className="border-line border-t p-2.5">
                      <p className="text-muted mb-2 text-xs">Size for {addon.name}</p>
                      <SizeSelector
                        sizes={options}
                        selected={choice.size}
                        onSelect={(size) => {
                          setAddonError(null);
                          setPicked((prev) => ({ ...prev, [addon.slug]: { size } }));
                        }}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          {addonError && (
            <p role="alert" className="text-rust mt-2 text-sm">
              {addonError}
            </p>
          )}
        </fieldset>
      )}

      <div className="mt-8">
        <fieldset>
          <legend className="u-caps text-muted">Delivery Method</legend>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="deliveryMethod"
                value="home"
                checked={deliveryMethod === "home"}
                onChange={() => setDeliveryMethod("home")}
                className="accent-brass h-4 w-4"
              />
              Home Delivery
            </label>
            <label
              className={`inline-flex min-h-11 items-center gap-2 text-sm ${
                product.storePickup ? "cursor-pointer" : "text-muted/50 cursor-not-allowed"
              }`}
            >
              <input
                type="radio"
                name="deliveryMethod"
                value="store"
                checked={deliveryMethod === "store"}
                onChange={() => setDeliveryMethod("store")}
                disabled={!product.storePickup}
                className="accent-brass h-4 w-4"
              />
              {product.storePickup ? "Store Pick-up" : "Store Pick-up (not available)"}
            </label>
          </div>
        </fieldset>
        {product.storePickup && (
          <p className="text-muted mt-1 text-xs">
            Pick up from{" "}
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brass-deep underline underline-offset-2"
            >
              {STORE_ADDRESS}
            </a>
            .
          </p>
        )}
      </div>

      <div className="mt-9 flex items-center gap-3">
        <button type="button" onClick={handleAddToCart} className="u-btn u-caps flex-1">
          {added
            ? "Added ✓"
            : pickedAddons.length > 0
              ? `Add ${pickedAddons.length + 1} to Cart · ${formatPKR(total)}`
              : "Add to Cart"}
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
