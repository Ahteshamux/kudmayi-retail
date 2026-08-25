import type { Metadata } from "next";

// The internal catalog tool — keep it out of search results, and label it
// distinctly from the public site that now shares the root layout with it.
export const metadata: Metadata = {
  title: "Kudmayi Retail",
  description: "Catalog management for Kudmayi.",
  robots: { index: false, follow: false },
};

export default function AdminCatalogLayout({
  children,
}: LayoutProps<"/admin/catalog">) {
  return children;
}
