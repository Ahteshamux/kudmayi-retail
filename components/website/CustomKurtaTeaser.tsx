import { ResponsiveSlotImage } from "./ResponsiveSlotImage";
import Link from "next/link";
import { Reveal } from "./Reveal";
import type { HomepageImage } from "@/lib/website/homepage-content";

/*
 * Currently unused (see app/(website)/page.tsx) — pulled from the homepage
 * for now. Before it comes back: this is the one section on the page that
 * doesn't use `u-section` for its vertical rhythm — it relies on its own
 * px-5 py-14 padding instead, which is what made the gap around it read as
 * "different" from every other section. Switch the outer <section> to
 * `u-section` (matching CategorySection, SignatureSherwani, etc.) and drop
 * the ad-hoc py-14/lg:py-0 before re-adding it, so its spacing actually
 * matches its neighbours instead of only visually approximating them.
 */
export function CustomKurtaTeaser({ image }: { image: HomepageImage }) {
  return (
    <section aria-labelledby="custom-kurta-heading" className="bg-sand">
      <div className="u-container grid gap-0 lg:grid-cols-3">
        <Reveal className="order-2 flex flex-col justify-center px-5 py-14 lg:order-1 lg:col-span-1 lg:px-10 lg:py-0">
          <p className="u-caps text-brass-deep">Made to Order</p>
          <h2
            id="custom-kurta-heading"
            className="font-display mt-4 text-3xl sm:text-4xl"
          >
            Made Around You.
          </h2>
          <p className="text-muted mt-5 max-w-xs">
            Choose your fabric, silhouette, and detail — cut to your
            measurements.
          </p>
          <Link href="/custom-kurta" className="u-btn u-caps mt-8 inline-flex self-start">
            Customize Your Kurta
          </Link>
        </Reveal>

        {/*
          * The min-height matters on lg. aspect-auto leaves this column with
          * no intrinsic height — the image inside is absolutely positioned —
          * so the row collapsed to the height of the copy beside it and the
          * whole panel came out 211px tall.
          *
          * Both figures are 25% taller than that baseline (aspect-[4/3] and
          * min-h-[32rem]), requested explicitly: 3 → 3.75, 32rem → 40rem.
          */}
        <div className="bg-well relative order-1 aspect-[4/3.75] lg:order-2 lg:col-span-2 lg:aspect-auto lg:min-h-[40rem]">
          <ResponsiveSlotImage
            image={image}
            sizes="(max-width: 1023px) 100vw, 66vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
