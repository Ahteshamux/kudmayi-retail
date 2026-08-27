import type { Metadata } from "next";

/**
 * Wraps every admin area. The robots directive lives here rather than in
 * each section's own layout, so any admin route added later is kept out of
 * search results by default instead of relying on someone remembering.
 */
export const metadata: Metadata = {
  title: {
    default: "Kudmayi Admin",
    template: "%s · Kudmayi Admin",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
