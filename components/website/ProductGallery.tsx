"use client";

import Image from "next/image";
import { useState } from "react";
import type { PlaceholderImage } from "@/lib/website/placeholder-images";

/**
 * Thumbnail rail + main image with prev/next and dot pagination. Only two
 * images exist per placeholder product (its cover + hover shot); real
 * product photography will bring a full angle set, but the gallery itself
 * doesn't need to change shape for that — it already maps over a list.
 */
export function ProductGallery({
  images,
  productName,
}: {
  images: PlaceholderImage[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const image = images[active];

  function go(delta: number) {
    setActive((i) => (i + delta + images.length) % images.length);
  }

  return (
    <div className="flex gap-3">
      {images.length > 1 && (
        <div className="hidden w-16 shrink-0 flex-col gap-3 sm:flex">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${productName}`}
              aria-current={i === active}
              className={`bg-well relative aspect-[3/4] overflow-hidden border transition-colors ${
                i === active ? "border-brass-deep" : "border-transparent"
              }`}
            >
              <Image src={img.src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="bg-well relative aspect-[3/4] flex-1 overflow-hidden">
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 45vw"
          className="object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="bg-parchment/90 text-espresso absolute top-1/2 left-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full"
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="bg-parchment/90 text-espresso absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full"
            >
              <ArrowIcon direction="right" />
            </button>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show image ${i + 1} of ${productName}`}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    i === active ? "bg-parchment" : "bg-parchment/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        d={direction === "left" ? "M12 4 6 10l6 6" : "M8 4l6 6-6 6"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
