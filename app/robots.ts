import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/website/constants";

/**
 * Tells crawlers which parts of the site to index and where to find the
 * sitemap. Blocks /admin/ entirely from crawling (the meta robots tags
 * already prevent indexing, but this saves the crawl budget too).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
