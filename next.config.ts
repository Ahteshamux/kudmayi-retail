import type { NextConfig } from "next";

// Product photos are served from Supabase Storage; next/image needs the host
// on the allowlist before it will optimise them.
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  // Don't advertise the framework. It's free reconnaissance for anyone
  // scanning for version-specific exploits, and it buys nothing.
  poweredByHeader: false,

  async headers() {
    return [
      {
        // Baseline hardening for every route. None of these need a nonce
        // or per-page tuning, so they're set once here rather than in the
        // proxy.
        source: "/:path*",
        headers: [
          // Nobody has a reason to frame this site; blocking it removes
          // clickjacking as a way to trick someone into an admin action.
          { key: "X-Frame-Options", value: "DENY" },
          // Stops a browser second-guessing Content-Type and treating an
          // uploaded image as script.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Send the origin cross-site, never the full path — product and
          // search URLs shouldn't leak to third parties in Referer.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // The storefront asks for none of these; deny them outright.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        /*
         * Never let a shared cache hold on to the admin tool's HTML or
         * Server Action responses — it's auth-gated and its own data
         * changes constantly. The public storefront is static/cacheable,
         * so it's excluded here.
         */
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, must-revalidate" },
        ],
      },
    ];
  },
  images: {
    /*
     * Next.js only serves the quality values listed here — anything else
     * throws at request time. Homepage full-bleed photography (hero,
     * editorial bands) asks for 90 explicitly in ResponsiveSlotImage.tsx;
     * 75 stays the default for everything else (product photos), which
     * render far smaller and don't need it.
     */
    qualities: [75, 90],
    remotePatterns: [
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      // Temporary placeholder photography for the public site — swap for
      // owned/licensed assets before production. TODO(pre-launch).
      {
        protocol: "https" as const,
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
