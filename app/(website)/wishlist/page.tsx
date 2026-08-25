import type { Metadata } from "next";
import { Breadcrumb } from "@/components/website/Breadcrumb";
import { WishlistView } from "@/components/website/WishlistView";

export const metadata: Metadata = {
  title: "Wishlist",
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <div className="u-container pt-32 pb-24 sm:pt-40">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <h1 className="font-display mt-6 text-4xl sm:text-5xl">Wishlist</h1>
      <WishlistView />
    </div>
  );
}
