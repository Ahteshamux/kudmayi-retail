import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

// Fraunces is display-only — headings, all at regular weight. Pinning the
// single static weight we actually use, rather than shipping the variable
// font, keeps first load light on mobile data.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kudmayi Retail",
  description: "Catalog management for Kudmayi.",
  // Saved to a phone home screen, this is the label under the icon.
  appleWebApp: {
    capable: true,
    title: "Kudmayi",
    statusBarStyle: "default",
  },
  // Internal tool — keep it out of search results.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#F3ECDF",
  // Let the page fill a notched screen; padding below keeps content clear.
  viewportFit: "cover",
  // Capped rather than disabled — pinching to inspect a fabric detail is
  // exactly what she'll want to do on a product photo.
  maximumScale: 5,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
      // Browser extensions inject attributes onto <html> before React
      // hydrates (password managers, ad blockers). Those mismatches are
      // noise and would otherwise bury real ones.
      suppressHydrationWarning
    >
      <body className="bg-parchment text-espresso flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}
