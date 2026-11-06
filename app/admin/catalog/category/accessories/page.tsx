import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { SectionLabel } from "@/components/SectionLabel";
import { ACCESSORY_SLUGS, CATEGORIES } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** The Retail "Accessories" button: one more level, Turbans and Groom Footwear. */
export default async function RetailAccessoriesPage() {
  const sections = CATEGORIES.filter((c) => ACCESSORY_SLUGS.includes(c.slug));
  const supabase = await createClient();
  const counts = await Promise.all(
    sections.map((c) =>
      supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("category", c.slug)
        .then((r) => r.count ?? 0),
    ),
  );

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
        <Link
          href="/admin/catalog"
          className="u-caps text-muted hover:text-brass-deep mb-8 inline-block transition-colors"
        >
          &larr; All collections
        </Link>
        <h1 className="font-display mb-10 text-4xl sm:text-5xl">Accessories</h1>
        <div className="grid gap-px sm:grid-cols-2">
          {sections.map((section, i) => (
            <Link
              key={section.slug}
              href={`/admin/catalog/category/${section.slug}`}
              className="group border-line hover:border-brass hover:bg-surface border p-7 transition-colors sm:p-9"
            >
              <SectionLabel>
                {counts[i]} {counts[i] === 1 ? "piece" : "pieces"}
              </SectionLabel>
              <h2 className="font-display group-hover:text-brass-deep mt-5 text-3xl transition-colors sm:text-[2rem]">
                {section.label}
              </h2>
              <span className="u-caps text-muted group-hover:text-brass-deep mt-6 inline-block transition-colors">
                View &rarr;
              </span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
