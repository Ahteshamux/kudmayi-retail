import Image from "next/image";
import type { PlaceholderImage } from "@/lib/website/placeholder-images";

/**
 * Pure image opening frame — no copy, no scrim, no CTA.
 *
 * The homepage still needs exactly one <h1> for accessibility/SEO; it's
 * kept here as visually-hidden text rather than dropped, so screen
 * readers and search engines still get a real page title even though
 * sighted visitors see none. If a video replaces the still image later,
 * this is also where a `<video>` element would go — no video asset exists
 * yet, so this stays a photo for now.
 */
export function Hero({ image }: { image: PlaceholderImage }) {
  return (
    <section aria-label="Kudmayi" className="relative">
      <h1 className="sr-only">Kudmayi — Crafted for the Occasion</h1>

      {/*
       * The container's aspect ratio changes per breakpoint (taller on
       * phones, wide on desktop) so object-cover crops the same photo
       * differently instead of just shrinking one fixed frame. Each ratio
       * here is ~30% taller than the previous pass.
       */}
      <div className="relative aspect-[4/6.5] w-full sm:aspect-[16/13] lg:aspect-[16/9] lg:min-h-[120vh]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
