import { ResponsiveSlotImage } from "./ResponsiveSlotImage";
import Link from "next/link";
import { Reveal } from "./Reveal";
import type { HomepageImage } from "@/lib/website/homepage-content";

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

        <div className="bg-well relative order-1 aspect-[4/3] lg:order-2 lg:col-span-2 lg:aspect-auto">
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
