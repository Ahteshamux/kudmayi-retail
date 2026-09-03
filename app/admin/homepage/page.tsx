import Link from "next/link";
import { HomepageImageSlot } from "@/components/admin/HomepageImageSlot";
import { HomepageTextSlot } from "@/components/admin/HomepageTextSlot";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getDb } from "@/lib/db/client";
import { getAllHomepageImages, getAllHomepageText } from "@/lib/website/homepage-content";
import { HOMEPAGE_IMAGE_SLOTS } from "@/lib/website/homepage-slots";
import { HOMEPAGE_TEXT_SLOTS } from "@/lib/website/homepage-text";

export const dynamic = "force-dynamic";

export default async function HomepageAdminPage() {
  const db = getDb();
  const [images, text] = await Promise.all([
    getAllHomepageImages(),
    getAllHomepageText(),
  ]);

  const sections = new Map<string, typeof HOMEPAGE_IMAGE_SLOTS>();
  for (const slot of HOMEPAGE_IMAGE_SLOTS) {
    const list = sections.get(slot.section) ?? [];
    list.push(slot);
    sections.set(slot.section, list);
  }

  const textSections = new Map<string, typeof HOMEPAGE_TEXT_SLOTS>();
  for (const slot of HOMEPAGE_TEXT_SLOTS) {
    const list = textSections.get(slot.section) ?? [];
    list.push(slot);
    textSections.set(slot.section, list);
  }

  return (
    <>
      <AdminHeader current="/admin/homepage" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:px-8">
        <div className="mb-4">
          <p className="u-caps text-brass-deep">Homepage</p>
          <h1 className="font-display mt-4 text-3xl sm:text-4xl">Photography</h1>
          <p className="text-muted mt-3 max-w-xl text-sm">
            Every photo on the homepage, grouped by section. Replace any of them —
            changes go live immediately, no separate publish step.
          </p>

          <div className="border-line bg-surface mt-6 max-w-xl border p-5">
            <p className="u-caps text-brass-deep">Before you upload</p>
            <ul className="text-muted mt-3 space-y-2 text-sm leading-relaxed">
              <li>
                <strong className="text-espresso">Each slot lists its own size.</strong>{" "}
                Bigger than the listed size is fine; smaller looks soft and can&rsquo;t be
                undone.
              </li>
              <li>
                <strong className="text-espresso">One photo, three crops.</strong> The same
                file is cut differently on phone, tablet, and desktop — so keep the subject
                centred with breathing room on all sides. Anything near an edge will be
                trimmed off on some screens.
              </li>
              <li>
                <strong className="text-espresso">JPEG, under about 1 MB.</strong> Photos are
                compressed automatically on upload, but starting smaller keeps the site fast.
              </li>
              <li>
                <strong className="text-espresso">Always fill in the alt text.</strong> It
                describes the photo to shoppers using a screen reader, and Google reads it too.
              </li>
            </ul>
          </div>
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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {slots.map((slot) => (
                  <HomepageImageSlot
                    key={slot.key}
                    slotKey={slot.key}
                    label={slot.label}
                    tiers={slot.tiers}
                    note={slot.note}
                    value={{
                      src: images[slot.key]?.src ?? slot.fallback.src,
                      alt: images[slot.key]?.alt ?? slot.fallback.alt,
                      tablet: images[slot.key]?.tablet,
                      mobile: images[slot.key]?.mobile,
                    }}
                  />
                ))}
              </div>

              {textSections.has(section) && (
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {textSections.get(section)!.map((slot) => (
                    <HomepageTextSlot
                      key={slot.key}
                      slotKey={slot.key}
                      label={slot.label}
                      value={text[slot.key] ?? slot.fallback}
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
