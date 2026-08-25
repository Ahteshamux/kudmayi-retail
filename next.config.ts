import type { NextConfig } from "next";

// Product photos are served from Supabase Storage; next/image needs the host
// on the allowlist before it will optimise them.
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  /*
   * Never let a shared cache hold on to the admin tool's HTML or Server
   * Action responses — it's auth-gated and its own data changes constantly.
   * The public storefront is static/cacheable, so it's excluded here.
   */
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, must-revalidate" },
        ],
      },
    ];
  },
  images: {
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
