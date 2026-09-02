import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import type { PlaceholderImage } from "@/lib/website/placeholder-images";

/**
 * Split-screen, matching SignatureSherwani — but mirrored. That section
 * puts its copy on the left and the photograph on the right; this one does
 * the reverse, so two neighbouring split-screens alternate instead of
 * repeating the same arrangement twice running.
 *
 * Both stack image-first on mobile, so the explicit order classes only
 * matter from lg up, where this one's image moves to the left column.
 */
export function PrinceCoatSection({ image }: { image: PlaceholderImage }) {
  return (
    <section aria-labelledby="prince-coat-heading" className="u-section">
      <div className="u-container grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="bg-well relative order-1 aspect-[3/4] overflow-hidden lg:order-1">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <Reveal className="order-2 lg:order-2">
          <p className="u-caps text-brass-deep">Tailoring</p>
          <h2 id="prince-coat-heading" className="font-display mt-4 text-3xl sm:text-4xl">
            The Prince Coat.
          </h2>
          <p className="text-muted mt-5 max-w-md">
            Structured, sharp, unmistakably formal — for the moments that call
            for restraint.
          </p>
          <Link href="#shop-by-category" className="u-btn u-caps mt-8 inline-flex">
            Explore Prince Coats
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
