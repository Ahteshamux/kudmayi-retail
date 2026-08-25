import type { Metadata } from "next";
import Link from "next/link";
import { whatsAppLink } from "@/lib/website/whatsapp";

export const metadata: Metadata = {
  title: "Custom Kurtas",
  description:
    "Choose your fabric, colour, fit and details — Kudmayi builds your kurta around you.",
};

/**
 * Stub for Phase 1 — the nav and the homepage's "Customize Your Kurta" CTA
 * both need a real destination. The full form (spec §25 — measurements,
 * reference image upload to Supabase Storage, submission to Postgres)
 * lands with the shopping-experience phase; this holds the route and
 * routes interest to WhatsApp in the meantime.
 */
export default function CustomKurtaPage() {
  return (
    <div className="u-container pt-32 pb-24 sm:pt-40">
      <div className="max-w-xl">
        <p className="u-caps text-brass-deep">Made to Order</p>
        <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">
          Made Around You.
        </h1>
        <p className="text-muted mt-6">
          Choose your fabric, colour, fit and details — we&rsquo;ll create
          your kurta around you. The full custom-order form is on its way;
          for now, reach us on WhatsApp and we&rsquo;ll take it from there.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <Link
            href={whatsAppLink(
              "Hi Kudmayi, I'd like to customize a kurta.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="u-btn u-caps"
          >
            Continue on WhatsApp
          </Link>
          <Link href="/" className="u-btn-ghost u-caps">
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
