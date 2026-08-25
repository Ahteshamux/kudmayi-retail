import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import type { PlaceholderImage } from "@/lib/website/placeholder-images";

/**
 * Split-screen — a deliberately different composition from the full-bleed
 * EditorialCampaign before it: image and copy sit side by side rather than
 * stacked, and the mobile order flips (copy first) instead of just
 * stacking the desktop order.
 */
export function SignatureSherwani({ image }: { image: PlaceholderImage }) {
  return (
    <section aria-labelledby="signature-heading" className="u-section">
      <div className="u-container grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <p className="u-caps text-brass-deep">Signature</p>
          <h2 id="signature-heading" className="font-display mt-4 text-3xl sm:text-4xl">
            The Sherwani, Reimagined.
          </h2>
          <p className="text-muted mt-5 max-w-md">
            Hand-finished silhouettes in silk and raw tussar, built for the
            aisle and worn for a lifetime.
          </p>
          <Link href="#shop-by-category" className="u-btn u-caps mt-8 inline-flex">
            Shop Sherwanis
          </Link>
        </Reveal>

        <div className="bg-well relative order-1 aspect-[3/4] overflow-hidden lg:order-2">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
