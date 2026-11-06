import Link from "next/link";
import { ACCESSORIES_HREF, ACCESSORY_CATEGORIES } from "@/lib/website/categories";

/** Moves between the Accessories subsections: All, Turbans, Groom Footwear. */
export function AccessoryTabs({ current }: { current: string }) {
  const tabs = [
    { key: "accessories", label: "All", href: ACCESSORIES_HREF },
    ...ACCESSORY_CATEGORIES.map((c) => ({
      key: c.slug as string,
      label: c.label,
      href: `/shop/${c.slug}`,
    })),
  ];
  return (
    <nav aria-label="Accessories" className="mt-6 flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={tab.key === current ? "page" : undefined}
          className={`u-caps border px-4 py-2.5 transition-colors ${
            tab.key === current
              ? "bg-bark text-parchment border-bark"
              : "border-line text-muted hover:border-brass-deep hover:text-espresso"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
