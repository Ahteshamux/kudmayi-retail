import { ResponsiveSlotImage } from "./ResponsiveSlotImage";
import type { HomepageImage } from "@/lib/website/homepage-content";

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
export function Hero({ image }: { image: HomepageImage }) {
  return (
    <section aria-label="Kudmayi" className="relative">
      <h1 className="sr-only">Kudmayi — Crafted for the Occasion</h1>

      {/*
       * The container's aspect ratio changes per breakpoint (taller on
       * phones, wide on desktop) so object-cover crops the same photo
       * differently instead of just shrinking one fixed frame.
       *
       * Every figure here is 15% taller than the frame that exactly fills
       * one screen (requested explicitly, in full knowledge of the
       * trade-off below) — from lg up that means 115svh: 15% of the hero
       * now sits past the fold on first paint rather than the whole frame
       * landing inside it. The header still draws over the top of it
       * rather than above it, so 115svh is 115% of the true viewport, not
       * of a viewport minus the header.
       */}
      <div className="relative aspect-[4/7.475] w-full sm:aspect-[16/14.95] lg:aspect-auto lg:h-[115svh]">
        <ResponsiveSlotImage
          image={image}
          sizes="100vw"
          priority
          /*
           * Cropped toward the top from lg up, where the frame is wider
           * than the photograph and object-cover has ~400px of height to
           * discard. Centred, it took 200px off the top and the fixed
           * header covered 130px more, cutting through the groom's turban.
           * Below lg the frame and the photo are nearly the same ratio, so
           * there is no vertical crop to steer.
           */
          className="absolute inset-0 h-full w-full object-cover lg:object-[50%_10%]"
        />
      </div>
    </section>
  );
}
