import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/website/constants";
import { SHOP_CATEGORIES } from "@/lib/website/categories";

/**
 * Static sitemap covering every public route: the homepage, the
 * custom-kurta page, each category listing, and every product in the
 * placeholder catalog (40 products, mapped from their slugs).
 *
 * This file deliberately avoids importing from `lib/website/products.ts`
 * because that module pulls in the `postgres` driver (Node.js-only), and
 * the sitemap is compiled as an App Route where those modules can't be
 * resolved. Instead the product slugs are imported from a standalone
 * data file with no server-only dependencies.
 */
import { PRODUCT_SLUGS } from "@/lib/website/product-slugs";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/custom-kurta`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = SHOP_CATEGORIES.map((c) => ({
    url: `${SITE_URL}/shop/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const productPages: MetadataRoute.Sitemap = PRODUCT_SLUGS.map((slug) => ({
    url: `${SITE_URL}/product/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
