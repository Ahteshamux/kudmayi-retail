import Image from "next/image";
import Link from "next/link";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { SwatchTag } from "./SwatchTag";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group border-line hover:border-brass block border transition-colors"
    >
      <div className="bg-well relative aspect-[3/4] overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
              product.available ? "" : "opacity-55 grayscale-[0.4]"
            }`}
          />
        ) : (
          <div className="text-muted/70 u-caps flex h-full items-center justify-center">
            No photo
          </div>
        )}

        {/* Swatch tag pinned to the lower-left, like a label in a lining. */}
        <div className="absolute bottom-3 left-0">
          <SwatchTag color={product.color} />
        </div>
      </div>

      <div className="space-y-2.5 p-3">
        <h3 className="font-display group-hover:text-brass-deep text-[0.95rem] leading-snug transition-colors">
          {product.name}
        </h3>
        <AvailabilityBadge available={product.available} />
      </div>
    </Link>
  );
}
