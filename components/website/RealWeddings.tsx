import { ResponsiveSlotImage } from "./ResponsiveSlotImage";
import { Reveal } from "./Reveal";
import type { HomepageImages } from "@/lib/website/homepage-content";
import { REAL_WEDDINGS_IMAGES } from "@/lib/website/placeholder-images";

export function RealWeddings({ images }: { images: HomepageImages }) {
  // Captions are editorial copy, not photos — they stay with the static
  // list; only src/alt come from the admin-editable slot.
  const withOverrides = REAL_WEDDINGS_IMAGES.map((img, i) => ({
    ...img,
    ...images[`real_wedding_${i + 1}`],
  }));
  const [large, ...rest] = withOverrides;

  return (
    <section aria-labelledby="weddings-heading" className="u-section">
      <div className="u-container">
        <Reveal className="mb-10 lg:mb-14">
          <p className="u-caps text-brass-deep">Real Weddings</p>
          <h2 id="weddings-heading" className="font-display mt-4 text-3xl sm:text-4xl">
            Worn on the Day.
          </h2>
        </Reveal>

        {/* Desktop: editorial mosaic — one large frame, four smaller,
            varied sizes rather than uniform testimonial cards. The fixed
            row height (rather than aspect-ratio) is what lets the large
            tile span two rows cleanly. Mobile: single column, captions
            inline. */}
        <div className="grid gap-3 sm:grid-cols-3 sm:auto-rows-[280px]">
          <Figure image={large} className="aspect-[4/5] sm:col-span-2 sm:row-span-2 sm:aspect-auto" />
          {rest.map((image) => (
            <Figure key={image.src} image={image} className="aspect-[4/5] sm:aspect-auto" />
          ))}
        </div>
      </div>
    </section>
  );
}

function Figure({
  image,
  className = "",
}: {
  image: (typeof REAL_WEDDINGS_IMAGES)[number];
  className?: string;
}) {
  return (
    <figure className={`relative overflow-hidden ${className}`}>
      <ResponsiveSlotImage
        image={image}
        sizes="(max-width: 639px) 100vw, 45vw"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {image.caption && (
        <figcaption className="bg-black/25 text-parchment u-caps absolute bottom-3 left-3 px-3 py-1.5">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}
