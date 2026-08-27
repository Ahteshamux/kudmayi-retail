import Image from "next/image";
import { Reveal } from "./Reveal";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/website/constants";
import type { HomepageImages } from "@/lib/website/homepage-content";

export function InstagramGrid({ images }: { images: HomepageImages }) {
  const tiles = Array.from({ length: 6 }, (_, i) => images[`instagram_${i + 1}`]);

  return (
    <section aria-labelledby="instagram-heading" className="u-section">
      <div className="u-container">
        <Reveal className="mb-10 text-center lg:mb-14">
          <h2 id="instagram-heading" className="font-display text-3xl sm:text-4xl">
            Follow @{INSTAGRAM_HANDLE}
          </h2>
        </Reveal>
      </div>

      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Follow Kudmayi on Instagram, @${INSTAGRAM_HANDLE}`}
        className="group u-container grid grid-cols-3 gap-0.5"
      >
        {tiles.map((image) => (
          <div key={image.src} className="relative aspect-square overflow-hidden">
            <Image
              src={image.src}
              alt=""
              aria-hidden="true"
              fill
              sizes="(max-width: 639px) 33vw, 16vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </a>
    </section>
  );
}
