import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import type { PlaceholderImage } from "@/lib/website/placeholder-images";

export function EditorialCampaign({ image }: { image: PlaceholderImage }) {
  return (
    <section aria-labelledby="campaign-heading" className="relative">
      <div className="relative aspect-[21/9] w-full sm:aspect-[21/8]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/*
       * One copy block: on parchment below the image on phones, overlaid
       * centered on the image's own shaded region from sm up.
       */}
      <Reveal className="bg-parchment px-5 py-10 text-center sm:absolute sm:inset-0 sm:flex sm:items-center sm:justify-center sm:bg-transparent sm:py-0">
        <div className="sm:max-w-lg sm:px-6">
          <h2
            id="campaign-heading"
            className="font-display text-3xl leading-tight sm:text-parchment lg:text-5xl"
          >
            For the Moments That Matter.
          </h2>
          <Link href="#shop-by-category" className="u-btn u-caps mt-7 inline-flex sm:mt-8">
            Discover the Collection
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
