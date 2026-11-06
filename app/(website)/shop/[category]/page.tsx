import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/website/Breadcrumb";
import { AccessoryTabs } from "@/components/website/AccessoryTabs";
import { ShopListing } from "@/components/website/ShopListing";
import {
  ACCESSORIES_HREF,
  isAccessoryCategory,
  isShopCategorySlug,
  SHOP_CATEGORIES,
  shopCategoryLabel,
} from "@/lib/website/categories";
import { SITE_URL } from "@/lib/website/constants";
import {
  JsonLd,
  breadcrumbJsonLd,
  itemListJsonLd,
} from "@/lib/website/json-ld";
import { getProductsByCategory } from "@/lib/website/products";

export function generateStaticParams() {
  return SHOP_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category } = await params;
  if (!isShopCategorySlug(category)) return {};
  const label = shopCategoryLabel(category);
  const url = `${SITE_URL}/shop/${category}`;
  const description = `Shop ${label.toLowerCase()} from Kudmayi — hand-finished Pakistani menswear and weddingwear. Browse the full collection and order online.`;

  return {
    title: label,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${label} — Kudmayi`,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${label} — Kudmayi`,
      description,
    },
  };
}

export default async function ShopCategoryPage({
  params,
}: PageProps<"/shop/[category]">) {
  const { category } = await params;
  if (!isShopCategorySlug(category)) notFound();

  const label = shopCategoryLabel(category);
  const products = await getProductsByCategory(category);
  const accessory = isAccessoryCategory(category);

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Shop" },
    ...(accessory ? [{ name: "Accessories", url: `${SITE_URL}${ACCESSORIES_HREF}` }] : []),
    { name: label },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <JsonLd data={itemListJsonLd(category, products)} />

      <div className="u-container pt-32 pb-24 sm:pt-40">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Shop" },
            ...(accessory ? [{ label: "Accessories", href: ACCESSORIES_HREF }] : []),
            { label },
          ]}
        />

        <h1 className="font-display mt-6 text-4xl sm:text-5xl">{label}</h1>
        {accessory && <AccessoryTabs current={category} />}

        <div className="mt-8">
          <ShopListing products={products} currentCategory={category} />
        </div>
      </div>
    </>
  );
}
