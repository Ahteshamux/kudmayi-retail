"use client";

import { useMemo, useState } from "react";
import { ReadyToShipToggle, ShopFilterBar, type SortOption } from "./ShopFilterBar";
import { ShopProductCard } from "./ShopProductCard";
import type { ShopCategorySlug } from "@/lib/website/categories";
import { sizesForCategory } from "@/lib/website/category-copy";
import { effectivePriceRupees } from "@/lib/website/pricing";
import type { Product } from "@/lib/website/products";

const PRICE_BANDS = [
  { key: "under-50k", label: "Under PKR 50,000", test: (p: number) => p < 50_000 },
  { key: "50k-100k", label: "PKR 50,000 – 100,000", test: (p: number) => p >= 50_000 && p < 100_000 },
  { key: "100k-150k", label: "PKR 100,000 – 150,000", test: (p: number) => p >= 100_000 && p < 150_000 },
  { key: "over-150k", label: "Above PKR 150,000", test: (p: number) => p >= 150_000 },
];

function toggleIn(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/**
 * Owns every filter/sort/density state for a category listing and renders
 * both the filter bar and the product grid, so the two always agree on
 * what's currently shown. Filtering happens entirely client-side over the
 * category's product list (already fetched server-side) — the catalog is
 * small enough per category that this is instant and needs no URL/round
 * trip; see ShopFilterBar's doc comment for the toggle-level details.
 */
export function ShopListing({
  products,
  currentCategory,
}: {
  products: Product[];
  currentCategory: ShopCategorySlug;
}) {
  const [readyToShipOnly, setReadyToShipOnly] = useState(false);
  const [selectedPriceBands, setSelectedPriceBands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("newest");
  const [dense, setDense] = useState(false);

  const colors = useMemo(
    () => Array.from(new Set(products.map((p) => p.colorName))).sort(),
    [products],
  );
  const sizes = useMemo(() => {
    const all = new Set<string>();
    for (const p of products) {
      for (const s of p.sizes.length > 0 ? p.sizes : sizesForCategory()) all.add(s);
    }
    return Array.from(all);
  }, [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (readyToShipOnly) list = list.filter((p) => p.readyToShip);
    if (selectedPriceBands.length > 0) {
      const bands = PRICE_BANDS.filter((b) => selectedPriceBands.includes(b.key));
      list = list.filter((p) => bands.some((b) => b.test(effectivePriceRupees(p))));
    }
    if (selectedColors.length > 0) {
      list = list.filter((p) => selectedColors.includes(p.colorName));
    }
    if (selectedSizes.length > 0) {
      list = list.filter((p) => {
        const productSizes = p.sizes.length > 0 ? p.sizes : sizesForCategory();
        return selectedSizes.some((s) => productSizes.includes(s));
      });
    }

    const sorted = [...list];
    if (sort === "price-asc") {
      sorted.sort((a, b) => effectivePriceRupees(a) - effectivePriceRupees(b));
    } else if (sort === "price-desc") {
      sorted.sort((a, b) => effectivePriceRupees(b) - effectivePriceRupees(a));
    }
    return sorted;
  }, [products, readyToShipOnly, selectedPriceBands, selectedColors, selectedSizes, sort]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ReadyToShipToggle checked={readyToShipOnly} onChange={setReadyToShipOnly} />
      </div>

      <div className="mt-8">
        <ShopFilterBar
          count={filtered.length}
          currentCategory={currentCategory}
          colors={colors}
          sizes={sizes}
          priceBands={PRICE_BANDS}
          selectedColors={selectedColors}
          onToggleColor={(color) => setSelectedColors((prev) => toggleIn(prev, color))}
          selectedSizes={selectedSizes}
          onToggleSize={(size) => setSelectedSizes((prev) => toggleIn(prev, size))}
          selectedPriceBands={selectedPriceBands}
          onTogglePriceBand={(key) => setSelectedPriceBands((prev) => toggleIn(prev, key))}
          sort={sort}
          onSortChange={setSort}
          dense={dense}
          onDensityChange={setDense}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted mt-16 text-center">No pieces match these filters.</p>
      ) : (
        <div
          className={`mt-10 grid gap-x-5 gap-y-10 sm:gap-x-6 ${
            dense ? "grid-cols-3 lg:grid-cols-5" : "grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {filtered.map((product) => (
            <ShopProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
