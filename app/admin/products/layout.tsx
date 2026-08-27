import type { Metadata } from "next";

// robots: noindex is inherited from app/admin/layout.tsx.
export const metadata: Metadata = {
  title: "Products",
};

export default function Layout({ children }: LayoutProps<"/admin/products">) {
  return children;
}
