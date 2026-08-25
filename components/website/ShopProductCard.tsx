import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/website/products";
import { formatPKR } from "@/lib/website/format";
import { WishlistToggleButton } from "./WishlistToggleButton";

/**
 * Richer than the homepage's ProductCard (which stays deliberately bare
 * per the design spec) — a wishlist icon and a "Ready to Ship" badge, to
 * match the reference listing-page layout. The wishlist button is a
 * sibling of the Link, not nested inside it — a <button> inside an <a> is
 * invalid HTML, so it's positioned on top via the shared relative parent
 * instead.
 */
export function ShopProductCard({ product }: { product: Product }) {
  const onSale = product.salePriceRupees !== null;
  const badges = [...(onSale ? ["Sale"] : []), ...product.tags];

  return (
    <div className="group relative">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="bg-well relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 23vw"
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          <Image
            src={product.hoverImage.src}
            alt={product.hoverImage.alt}
            fill
            sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 23vw"
            className="object-cover opacity-0 transition-[opacity,transform] duration-500 group-hover:scale-105 group-hover:opacity-100"
          />

          {badges.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className={`u-caps px-2.5 py-1 text-[0.625rem] ${
                    badge === "Sale"
                      ? "bg-rust text-parchment"
                      : "bg-parchment/90 text-espresso"
                  }`}
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3.5 space-y-1.5">
          <p className="text-brass-deep u-caps text-[0.6875rem]">Kudmayi</p>
          <h3 className="font-display text-[0.95rem] leading-snug">{product.name}</h3>
          {onSale ? (
            <p className="text-sm">
              <span className="text-muted line-through">{formatPKR(product.priceRupees)}</span>{" "}
              <span className="text-rust">{formatPKR(product.salePriceRupees!)}</span>
            </p>
          ) : (
            <p className="text-sm">{formatPKR(product.priceRupees)}</p>
          )}
          {product.readyToShip && (
            <span className="border-line u-caps mt-1 inline-block border px-2.5 py-1 text-[0.625rem]">
              Ready to Ship
            </span>
          )}
        </div>
      </Link>

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
        className="text-espresso bg-parchment/80 hover:bg-parchment absolute top-3 right-3 z-10 rounded-full p-1.5 transition-colors"
      />
    </div>
  );
}
