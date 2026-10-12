import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/website/AnnouncementBar";
import { CommerceProviders } from "@/components/website/CommerceProviders";
import { Footer } from "@/components/website/Footer";
import { HeaderScrollBoundary } from "@/components/website/HeaderScrollBoundary";
import { SiteHeader } from "@/components/website/SiteHeader";
import { WhatsAppButton } from "@/components/website/WhatsAppButton";
import {
  JsonLd,
  organizationJsonLd,
  webSiteJsonLd,
} from "@/lib/website/json-ld";

/*
 * The live site sits behind Hostinger's CDN, which honours s-maxage.
 * Fully static pages get s-maxage=31536000 (a year), and revalidatePath()
 * only clears Next's own cache — never the CDN — so a product saved in the
 * admin stayed invisible to shoppers. A 60-second window keeps pages
 * CDN-cached but lets new products and price changes appear within a
 * minute. Applies to every storefront page below this layout.
 */
export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    default: "Kudmayi — Crafted for the Occasion",
    template: "%s · Kudmayi",
  },
  description:
    "Kudmayi is a Pakistani menswear and weddingwear house — sherwanis, prince coats, bandhgalas, waistcoats, kurtas, and bespoke tailoring, crafted for the occasion.",
  openGraph: {
    title: "Kudmayi — Crafted for the Occasion",
    description:
      "Pakistani menswear and weddingwear — sherwanis, prince coats, waistcoats, kurtas, and bespoke tailoring.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function WebsiteLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <CommerceProviders>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={webSiteJsonLd()} />

      <HeaderScrollBoundary announcementBar={<AnnouncementBar />}>
        <SiteHeader />
      </HeaderScrollBoundary>

      <main className="flex-1">{children}</main>

      <Footer />
      <WhatsAppButton />
    </CommerceProviders>
  );
}
