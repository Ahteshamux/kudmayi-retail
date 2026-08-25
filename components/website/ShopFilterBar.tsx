"use client";

import Link from "next/link";
import { ChevronDownIcon, GridIcon } from "./icons";
import { SHOP_CATEGORIES, type ShopCategorySlug } from "@/lib/website/categories";

export type SortOption = "newest" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};

/**
 * Real filter/sort row — every control here changes what's on screen.
 * Category, Price, Color, and Size open native <details> dropdowns (same
 * zero-JS-for-the-toggle approach as AccordionItem); filter state itself
 * lives in the parent (ShopListing), which owns the product list these
 * controls narrow down.
 */
export function ShopFilterBar({
  count,
  currentCategory,
  colors,
  sizes,
  priceBands,
  selectedColors,
  onToggleColor,
  selectedSizes,
  onToggleSize,
  selectedPriceBands,
  onTogglePriceBand,
  sort,
  onSortChange,
  dense,
  onDensityChange,
}: {
  count: number;
  currentCategory: ShopCategorySlug;
  colors: string[];
  sizes: string[];
  priceBands: { key: string; label: string }[];
  selectedColors: string[];
  onToggleColor: (color: string) => void;
  selectedSizes: string[];
  onToggleSize: (size: string) => void;
  selectedPriceBands: string[];
  onTogglePriceBand: (key: string) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  dense: boolean;
  onDensityChange: (dense: boolean) => void;
}) {
  return (
    <div className="border-line flex flex-wrap items-center justify-between gap-4 border-y py-4">
      <div className="flex flex-wrap items-center gap-6">
        <FilterDropdown label="Category">
          <ul className="space-y-2">
            {SHOP_CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/shop/${c.slug}`}
                  className={`text-sm transition-colors ${
                    c.slug === currentCategory
                      ? "text-brass-deep font-medium"
                      : "text-muted hover:text-espresso"
                  }`}
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </FilterDropdown>

        <FilterDropdown label="Price" active={selectedPriceBands.length > 0}>
          <ul className="space-y-2">
            {priceBands.map((band) => (
              <li key={band.key}>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedPriceBands.includes(band.key)}
                    onChange={() => onTogglePriceBand(band.key)}
                  />
                  {band.label}
                </label>
              </li>
            ))}
          </ul>
        </FilterDropdown>

        <FilterDropdown label="Color" active={selectedColors.length > 0}>
          <ul className="max-h-56 space-y-2 overflow-y-auto">
            {colors.map((color) => (
              <li key={color}>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color)}
                    onChange={() => onToggleColor(color)}
                  />
                  {color}
                </label>
              </li>
            ))}
          </ul>
        </FilterDropdown>

        <FilterDropdown label="Size" active={selectedSizes.length > 0}>
          <ul className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const checked = selectedSizes.includes(size);
              return (
                <li key={size}>
                  <button
                    type="button"
                    onClick={() => onToggleSize(size)}
                    aria-pressed={checked}
                    className={`u-caps flex h-8 min-w-8 items-center justify-center border px-2 text-[0.625rem] transition-colors ${
                      checked
                        ? "border-brass-deep bg-brass-deep text-parchment"
                        : "border-line hover:border-brass"
                    }`}
                  >
                    {size}
                  </button>
                </li>
              );
            })}
          </ul>
        </FilterDropdown>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => onDensityChange(false)}
            aria-label="Compact grid"
            aria-pressed={!dense}
            className={dense ? "text-muted/50" : "text-espresso"}
          >
            <GridIcon />
          </button>
          <button
            type="button"
            onClick={() => onDensityChange(true)}
            aria-label="Dense grid"
            aria-pressed={dense}
            className={dense ? "text-espresso" : "text-muted/50"}
          >
            <GridIcon dense />
          </button>
        </div>

        <span className="text-muted text-sm">
          {count} {count === 1 ? "Result" : "Results"}
        </span>

        <FilterDropdown label="Sort" align="right">
          <ul className="space-y-2">
            {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => onSortChange(option)}
                  className={`text-sm transition-colors ${
                    sort === option ? "text-brass-deep font-medium" : "text-muted hover:text-espresso"
                  }`}
                >
                  {SORT_LABELS[option]}
                </button>
              </li>
            ))}
          </ul>
        </FilterDropdown>
      </div>
    </div>
  );
}

function FilterDropdown({
  label,
  active = false,
  align = "left",
  children,
}: {
  label: string;
  active?: boolean;
  align?: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <details className="group relative">
      <summary
        className={`u-caps inline-flex list-none items-center gap-1.5 transition-colors ${
          active ? "text-brass-deep" : "text-muted hover:text-espresso"
        }`}
      >
        {label}
        <ChevronDownIcon className="h-2.5 w-2.5 transition-transform group-open:rotate-180" />
      </summary>
      <div
        className={`bg-parchment border-line absolute top-full z-20 mt-3 min-w-48 border p-4 shadow-[0_8px_24px_rgba(23,20,16,0.15)] ${
          align === "right" ? "right-0" : "left-0"
        }`}
      >
        {children}
      </div>
    </details>
  );
}

/** Real toggle — filters the listing to readyToShip products only. */
export function ReadyToShipToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className="text-muted inline-flex shrink-0 items-center gap-2.5 text-sm"
    >
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full border transition-colors ${
          checked ? "bg-brass-deep border-brass-deep" : "bg-well border-line"
        }`}
      >
        <span
          className={`bg-parchment absolute inline-block h-3.5 w-3.5 rounded-full transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
      Ready to Ship
    </button>
  );
}
