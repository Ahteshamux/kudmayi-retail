import Link from "next/link";
import { HomepageImageSlot } from "@/components/admin/HomepageImageSlot";
import { ProductsAdminHeader } from "@/components/admin/ProductsAdminHeader";
import { getDb } from "@/lib/db/client";
import { getAllHomepageImages } from "@/lib/website/homepage-content";
import { HOMEPAGE_IMAGE_SLOTS } from "@/lib/website/homepage-slots";

export const dynamic = "force-dynamic";

export default async function HomepageAdminPage() {
  const db = getDb();
  const images = await getAllHomepageImages();

  const sections = new Map<string, typeof HOMEPAGE_IMAGE_SLOTS>();
  for (const slot of HOMEPAGE_IMAGE_SLOTS) {
    const list = sections.get(slot.section) ?? [];
    list.push(slot);
    sections.set(slot.section, list);
  }

  return (
    <>
      <ProductsAdminHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:px-8">
        <div className="mb-4">
          <p className="u-caps text-brass-deep">Homepage</p>
          <h1 className="font-display mt-4 text-3xl sm:text-4xl">Photography</h1>
          <p className="text-muted mt-3 max-w-lg text-sm">
            Every photo on the homepage, grouped by section. Replace any of them —
            changes go live immediately, no separate publish step.
          </p>
        </div>

        {!db && (
          <p className="text-rust border-line mt-6 max-w-lg border p-4 text-sm">
            The database isn&rsquo;t connected yet — replacements won&rsquo;t save until it
            is. See the setup notes on{" "}
            <Link href="/admin/products" className="underline">
              the product list page
            </Link>
            .
          </p>
        )}

        <div className="mt-10 space-y-12">
          {Array.from(sections.entries()).map(([section, slots]) => (
            <section key={section}>
              <h2 className="font-display border-line mb-5 border-b pb-3 text-2xl">
                {section}
              </h2>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
                {slots.map((slot) => (
                  <HomepageImageSlot
                    key={slot.key}
                    slotKey={slot.key}
                    label={slot.label}
                    currentSrc={images[slot.key]?.src ?? slot.fallback.src}
                    currentAlt={images[slot.key]?.alt ?? slot.fallback.alt}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
