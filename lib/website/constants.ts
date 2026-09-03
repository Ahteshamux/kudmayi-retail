/**
 * The public-facing base URL of the site. Used by sitemap.ts, robots.ts,
 * JSON-LD structured data, and Open Graph / canonical metadata.
 *
 * Defaults to the live domain, so a production build is correct even if the
 * host forgets to set an env var — getting this wrong silently publishes
 * canonical URLs and a sitemap pointing at localhost, which is the kind of
 * bug nobody notices until search results are already wrong.
 *
 * Override with NEXT_PUBLIC_SITE_URL for staging or preview deployments.
 * In `next dev` it points at localhost automatically, so local canonicals
 * don't claim to be the production URL.
 */
const PRODUCTION_URL = "https://kudmayi.pk";

const raw =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:3000" : PRODUCTION_URL);

/** Guaranteed no trailing slash. */
export const SITE_URL = raw.replace(/\/+$/, "");

/** Bare host, for display in admin UI ("kudmayi.pk/product/…"). */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");

/**
 * TODO(pre-launch): confirm this mailbox exists on the kudmayi.pk domain
 * before launch — it's published in the footer and in Organization JSON-LD,
 * so search engines and customers will both try to use it.
 */
export const CONTACT_EMAIL = "hello@kudmayi.pk";

/**
 * Instagram. Stored without the tracking parameters Instagram appends to
 * its QR/share links (igsi, utm_source) — those identify the share that
 * sent you and don't belong baked into every link on the site.
 */
export const INSTAGRAM_HANDLE = "kudmayi.official";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}`;

/** Public store location shown on the storefront. */
export const STORE_ADDRESS = "Gulberg, M.M. Alam Road, Lahore";

/** Opens the published address in Google Maps. */
export const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/KUDMAYI/@31.521113,74.351194,17z/data=!3m1!4b1!4m6!3m5!1s0x3919050038985707:0x395c85ba11d38c21!8m2!3d31.521113!4d74.351194!16s%2Fg%2F11xdfwg5f8";
