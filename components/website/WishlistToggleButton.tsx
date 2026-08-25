"use client";

import { useWishlist, type WishlistItem } from "./WishlistContext";
import { HeartIcon } from "./icons";

/**
 * Shared wishlist heart used on shop cards, the product page, and the
 * wishlist page itself. Always a sibling of any surrounding <Link>, never
 * nested inside one — a <button> inside an <a> is invalid HTML — so every
 * caller positions it absolutely against a shared `relative` parent.
 * preventDefault/stopPropagation guard against the card's own Link firing
 * when this sits visually on top of it.
 */
export function WishlistToggleButton({
  product,
  className = "",
  iconClassName = "h-4 w-4",
}: {
  product: WishlistItem;
  className?: string;
  iconClassName?: string;
}) {
  const { has, toggle } = useWishlist();
  const saved = has(product.slug);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product);
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      className={className}
    >
      <HeartIcon className={`${iconClassName} ${saved ? "text-rust" : ""}`} filled={saved} />
    </button>
  );
}
