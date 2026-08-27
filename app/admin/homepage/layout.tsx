import type { Metadata } from "next";

// robots: noindex is inherited from app/admin/layout.tsx.
export const metadata: Metadata = {
  title: "Homepage",
};

export default function Layout({ children }: LayoutProps<"/admin/homepage">) {
  return children;
}
