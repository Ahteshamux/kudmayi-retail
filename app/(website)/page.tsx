import { BespokeTeaser } from "@/components/website/BespokeTeaser";
import { BrandStory } from "@/components/website/BrandStory";
import { CategorySection } from "@/components/website/CategorySection";
import { EditorialCampaign } from "@/components/website/EditorialCampaign";
import { FeaturedCollection } from "@/components/website/FeaturedCollection";
import { Hero } from "@/components/website/Hero";
import { InstagramGrid } from "@/components/website/InstagramGrid";
import { PrinceCoatSection } from "@/components/website/PrinceCoatSection";
import { SignatureSherwani } from "@/components/website/SignatureSherwani";
import { SITE_URL } from "@/lib/website/constants";
import { getAllHomepageImages, getAllHomepageText } from "@/lib/website/homepage-content";
import type { Metadata } from "next";

/**
 * `absolute` because the (website) layout's title.default would otherwise
 * have the root layout's "%s · Kudmayi" template applied on top of it,
 * rendering "Kudmayi — Crafted for the Occasion · Kudmayi" in the tab and
 * in search results. Templates apply to titles set below them in the tree,
 * a layout `default` included; only `absolute` opts out.
 */
export const metadata: Metadata = {
  title: { absolute: "Kudmayi — Crafted for the Occasion" },
  alternates: { canonical: SITE_URL },
};

export default async function HomePage() {
  const [images, text] = await Promise.all([
    getAllHomepageImages(),
    getAllHomepageText(),
  ]);

  return (
    <>
      <Hero image={images.hero} />
      <CategorySection images={images} />
      <FeaturedCollection />
      <EditorialCampaign
        image={images.editorial_campaign}
        heading={text.editorial_campaign_heading}
      />
      <SignatureSherwani image={images.signature_sherwani} />
      <PrinceCoatSection image={images.prince_coat_section} />
      <BespokeTeaser />
      <BrandStory image={images.brand_story} />
      {/* CustomKurtaTeaser ("Made Around You"), CollectionsStrip ("Explore"),
       * and RealWeddings removed from the homepage for now, per request —
       * components and their homepage-image slots are untouched, so all
       * three drop back in with one line each whenever they're wanted
       * again. */}
      <InstagramGrid images={images} />
    </>
  );
}
