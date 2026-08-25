import Image from "next/image";
import { Reveal } from "./Reveal";
import type { PlaceholderImage } from "@/lib/website/placeholder-images";

export function BrandStory({ image }: { image: PlaceholderImage }) {
  return (
    <section id="story" aria-labelledby="story-heading" className="u-section">
      <div className="u-container grid gap-10 lg:grid-cols-5 lg:items-center lg:gap-16">
        <div className="bg-well relative aspect-[4/5] overflow-hidden lg:col-span-3">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1023px) 100vw, 60vw"
            className="object-cover"
          />
        </div>

        <Reveal className="lg:col-span-2">
          <p className="u-caps text-brass-deep">Our Story</p>
          <h2 id="story-heading" className="font-display mt-4 text-3xl sm:text-4xl">
            Kudmayi.
          </h2>
          <p className="text-muted mt-6 max-w-[60ch]">
            Rooted in Pakistani craft, built for the modern groom. Every piece
            is cut, embroidered, and finished by hand — silhouettes carried
            forward from generations of tailoring, made for how the day
            actually feels.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
