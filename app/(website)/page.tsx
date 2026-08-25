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
import { getAllHomepageImages } from "@/lib/website/homepage-content";

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
