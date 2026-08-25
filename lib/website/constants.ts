/**
 * The public-facing base URL of the site. Used by sitemap.ts, robots.ts,
 * JSON-LD structured data, and Open Graph / canonical metadata.
 *
 * In production set NEXT_PUBLIC_SITE_URL in your host's env; in development
 * it falls back to localhost:3000. Vercel auto-sets VERCEL_PROJECT_PRODUCTION_URL
 * on every deployment, so we read that as a second fallback before localhost.
 */
const raw =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

/** Guaranteed no trailing slash. */
export const SITE_URL = raw.replace(/\/+$/, "");
