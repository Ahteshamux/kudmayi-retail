import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kudmayi Homepage",
  description: "Homepage photography management for Kudmayi.",
  robots: { index: false, follow: false },
};

export default function HomepageAdminLayout({
  children,
}: LayoutProps<"/admin/homepage">) {
  return children;
}
