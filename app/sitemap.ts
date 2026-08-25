import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/website/constants";
import { SHOP_CATEGORIES } from "@/lib/website/categories";
import { listAllProducts } from "@/lib/website/products";

/**
 * Covers every public route: the homepage, the custom-kurta page, each
 * category listing, and every published product.
 *
 * Products come from the live catalog, not a hardcoded list — otherwise
 * anything added through /admin/products would never be submitted to
 * search engines, and anything deleted would keep being submitted as a
 * 404. listAllProducts() falls back to the placeholder catalog if the
 * database is unreachable, so this route still renders either way.
 *
 * This is a server-side route, so importing the Drizzle-backed module is
 * fine here — the "can't import products.ts" constraint applies only to
 * Client Components, which would drag the `postgres` driver into the
 * browser bundle (see lib/website/pricing.ts).
 *
 * Regenerated hourly rather than per-request: sitemaps are fetched by
 * every crawler and SEO scraper that finds the site, none of them rate
 * limited by us, and rendering on demand would mean an uncapped database
 * query per bot hit for data that changes a few times a week. Search
 * engines don't re-read a sitemap more often than this anyway, so a new
 * product appears within the hour — well inside what crawlers act on.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const products = await listAllProducts();
  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
