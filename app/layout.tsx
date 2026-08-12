import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kudmayi Retail",
  description: "Catalog management for Kudmayi.",
};

export const viewport: Viewport = {
  themeColor: "#171410",
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
      <body className="bg-espresso text-parchment flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}
