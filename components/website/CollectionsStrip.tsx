import Image from "next/image";
import { Reveal } from "./Reveal";
import type { HomepageImages } from "@/lib/website/homepage-content";

const COLLECTIONS = [
  { key: "wedding", label: "Wedding" },
  { key: "groom", label: "Groom" },
  { key: "eid", label: "Eid" },
  { key: "formal", label: "Formal" },
  { key: "new-arrivals", label: "New Arrivals" },
] as const;

export function CollectionsStrip({ images }: { images: HomepageImages }) {
  return (
    <section id="collections" aria-labelledby="collections-heading" className="u-section">
      <div className="u-container">
        <Reveal className="mb-10 lg:mb-14">
          <p className="u-caps text-brass-deep">Explore</p>
          <h2 id="collections-heading" className="font-display mt-4 text-3xl sm:text-4xl">
            Collections
          </h2>
        </Reveal>

        {/* A genuine 2-up grid on mobile — not a 1-column stack or a
            carousel — and 5 tall equal panels from sm up. */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {COLLECTIONS.map((collection) => {
            const image = images[`collection_${collection.key}`];
            return (
              <div
                key={collection.key}
                className="group relative aspect-[3/4] overflow-hidden"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 639px) 50vw, 20vw"
                  className="object-cover transition-[filter] duration-500 group-hover:brightness-75"
                />
                <span className="u-caps bg-black/25 text-parchment absolute bottom-4 left-4 px-3 py-1.5">
                  {collection.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
