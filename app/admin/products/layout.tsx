import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kudmayi Products",
  description: "Storefront product management for Kudmayi.",
  robots: { index: false, follow: false },
};

export default function ProductsAdminLayout({
  children,
}: LayoutProps<"/admin/products">) {
  return children;
}
