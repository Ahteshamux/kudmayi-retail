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
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      // Android crops an "any" icon to whatever shape the launcher uses — a
      // circle on Pixel, a squircle on Samsung — which would cut into the
      // calligraphy. The maskable copy pads the mark inside the 80% safe
      // circle so it survives every mask.
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
