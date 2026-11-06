import type { Metadata } from "next";
import { AccessoryTabs } from "@/components/website/AccessoryTabs";
import { Breadcrumb } from "@/components/website/Breadcrumb";
import { ShopListing } from "@/components/website/ShopListing";
import { ACCESSORIES_HREF, ACCESSORY_CATEGORIES } from "@/lib/website/categories";
import { SITE_URL } from "@/lib/website/constants";
import { JsonLd, breadcrumbJsonLd, itemListJsonLd } from "@/lib/website/json-ld";
import { getProductsByCategory } from "@/lib/website/products";

const description =
  "Turbans and groom footwear from Kudmayi — the finishing pieces for a Pakistani groom's wedding look. Browse and order online.";
const url = `${SITE_URL}${ACCESSORIES_HREF}`;

export const metadata: Metadata = {
  title: "Accessories",
  description,
  alternates: { canonical: url },
  openGraph: { title: "Accessories — Kudmayi", description, url, type: "website" },
  twitter: { card: "summary_large_image", title: "Accessories — Kudmayi", description },
};

export default async function AccessoriesPage() {
  const groups = await Promise.all(
    ACCESSORY_CATEGORIES.map((c) => getProductsByCategory(c.slug)),
  );
  const products = groups.flat();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Shop" },
          { name: "Accessories" },
        ])}
      />
      <JsonLd data={itemListJsonLd("accessories", products)} />

      <div className="u-container pt-32 pb-24 sm:pt-40">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Shop" }, { label: "Accessories" }]}
        />
        <h1 className="font-display mt-6 text-4xl sm:text-5xl">Accessories</h1>
        <AccessoryTabs current="accessories" />
        <div className="mt-8">
          <ShopListing products={products} currentCategory="accessories" />
        </div>
      </div>
    </>
  );
}
