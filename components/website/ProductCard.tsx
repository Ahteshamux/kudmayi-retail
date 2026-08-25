import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/website/products";
import { formatPKR } from "@/lib/website/format";

/**
 * Deliberately minimal — image, name, price. No badges, no add-to-cart
 * button; that comes with the real shopping experience in a later phase.
 */
export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
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
      </div>
      <div className="mt-3.5 space-y-1">
        <h3 className="font-display text-[0.95rem] leading-snug">{product.name}</h3>
        {product.salePriceRupees !== null ? (
          <p className="text-sm">
            <span className="text-muted line-through">{formatPKR(product.priceRupees)}</span>{" "}
            <span className="text-rust">{formatPKR(product.salePriceRupees)}</span>
          </p>
        ) : (
          <p className="text-muted text-sm">{formatPKR(product.priceRupees)}</p>
        )}
      </div>
    </Link>
  );
}
