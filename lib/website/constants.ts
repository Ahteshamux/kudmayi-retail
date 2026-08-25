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
