import type { MetadataRoute } from "next";

/**
 * Lets her add the app to a phone home screen and have it open fullscreen,
 * without browser chrome — it behaves like an app rather than a bookmark.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kudmayi",
    short_name: "Kudmayi",
    description: "Crafted for the occasion — Pakistani menswear and weddingwear.",
    start_url: "/",
    display: "standalone",
    background_color: "#F3ECDF",
    theme_color: "#F3ECDF",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
