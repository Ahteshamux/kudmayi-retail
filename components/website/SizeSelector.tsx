"use client";

/**
 * Controlled radio-like size picker — selection state lives in the parent
 * (ProductActions) so "Add to Cart" can read and validate it. Real,
 * keyboard-operable radio semantics, not decorative.
 */
export function SizeSelector({
  sizes,
  selected,
  onSelect,
}: {
  sizes: string[];
  selected: string | null;
  onSelect: (size: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Size" className="flex flex-wrap gap-2.5">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          role="radio"
          aria-checked={selected === size}
          onClick={() => onSelect(size)}
          className={`u-caps flex h-11 min-w-11 items-center justify-center border px-3 transition-colors ${
            selected === size
              ? "border-brass-deep bg-brass-deep text-parchment"
              : "border-line hover:border-brass"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
