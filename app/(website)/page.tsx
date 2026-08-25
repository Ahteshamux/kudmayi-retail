import { BespokeTeaser } from "@/components/website/BespokeTeaser";
import { BrandStory } from "@/components/website/BrandStory";
import { CategorySection } from "@/components/website/CategorySection";
import { CollectionsStrip } from "@/components/website/CollectionsStrip";
import { CustomKurtaTeaser } from "@/components/website/CustomKurtaTeaser";
import { EditorialCampaign } from "@/components/website/EditorialCampaign";
import { FeaturedCollection } from "@/components/website/FeaturedCollection";
import { Hero } from "@/components/website/Hero";
import { InstagramGrid } from "@/components/website/InstagramGrid";
import { PrinceCoatSection } from "@/components/website/PrinceCoatSection";
import { RealWeddings } from "@/components/website/RealWeddings";
import { SignatureSherwani } from "@/components/website/SignatureSherwani";
import { SITE_URL } from "@/lib/website/constants";
import { getAllHomepageImages } from "@/lib/website/homepage-content";
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
  const images = await getAllHomepageImages();

  return (
    <>
      <Hero image={images.hero} />
      <CategorySection images={images} />
      <FeaturedCollection />
      <EditorialCampaign image={images.editorial_campaign} />
      <SignatureSherwani image={images.signature_sherwani} />
      <PrinceCoatSection image={images.prince_coat_section} />
      <CustomKurtaTeaser image={images.custom_kurta} />
      <BespokeTeaser />
      <BrandStory image={images.brand_story} />
      <CollectionsStrip images={images} />
      <RealWeddings images={images} />
      <InstagramGrid images={images} />
    </>
  );
}
