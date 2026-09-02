import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import type { PlaceholderImage } from "@/lib/website/placeholder-images";

/**
 * A third, distinct composition: a short full-width letterbox image band
 * with copy as a separate block below it — neither the full-bleed overlay
 * of EditorialCampaign nor the split-screen of SignatureSherwani.
 */
export function PrinceCoatSection({ image }: { image: PlaceholderImage }) {
  return (
    <section aria-labelledby="prince-coat-heading" className="u-section">
      <div className="relative aspect-[21/9] w-full">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/*
        * u-container and the measure have to live on separate elements.
        * Together on one, max-w-lg overrode the container's 90rem and its
        * margin-inline:auto then centred the copy as a 32rem column adrift
        * in the middle of the page.
        */}
      <div className="u-container mt-10 lg:mt-14">
        <Reveal className="max-w-lg">
          <p className="u-caps text-brass-deep">Tailoring</p>
          <h2 id="prince-coat-heading" className="font-display mt-4 text-3xl sm:text-4xl">
            The Prince Coat.
          </h2>
          <p className="text-muted mt-5">
            Structured, sharp, unmistakably formal — for the moments that
            call for restraint.
          </p>
          <Link href="#shop-by-category" className="u-btn u-caps mt-8 inline-flex">
            Explore Prince Coats
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
