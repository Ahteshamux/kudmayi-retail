import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/website/Breadcrumb";
import { ShopListing } from "@/components/website/ShopListing";
import {
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

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Shop" },
    { name: label },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <JsonLd data={itemListJsonLd(category, products)} />

      <div className="u-container pt-32 pb-24 sm:pt-40">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop" }, { label }]} />

        <h1 className="font-display mt-6 text-4xl sm:text-5xl">{label}</h1>

        <div className="mt-8">
          <ShopListing products={products} currentCategory={category} />
        </div>
      </div>
    </>
  );
}
