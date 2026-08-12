import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { SectionLabel } from "@/components/SectionLabel";
import { CATEGORIES } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();

  // One round trip; counting in JS beats four count queries at this size.
  const { data, error } = await supabase.from("products").select("category");

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    counts.set(row.category, (counts.get(row.category) ?? 0) + 1);
  }

  const total = data?.length ?? 0;

  return (
    <>
      <AppHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-14">
          <p className="u-caps text-brass">The Collections</p>
          <h1 className="font-display mt-5 text-4xl leading-[1.15] sm:text-5xl">
            {total === 0
              ? "Your catalog starts here."
              : `${total} ${total === 1 ? "piece" : "pieces"} in the catalog.`}
          </h1>
        </div>

        {error && (
          <p role="alert" className="text-rust mb-8 text-sm">
            Couldn&rsquo;t load the catalog: {error.message}
          </p>
        )}

        <div className="grid gap-px sm:grid-cols-2">
          {CATEGORIES.map((category) => {
            const count = counts.get(category.slug) ?? 0;
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group border-brass/15 hover:border-brass/40 hover:bg-espresso-raised border p-7 transition-colors sm:p-9"
              >
                <SectionLabel>
                  {count} {count === 1 ? "piece" : "pieces"}
                </SectionLabel>

                <h2 className="font-display group-hover:text-brass mt-5 text-3xl transition-colors sm:text-[2rem]">
                  {category.label}
                </h2>

                <span className="u-caps text-muted group-hover:text-brass mt-6 inline-block transition-colors">
                  View &rarr;
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-12">
          <Link href="/product/new" className="u-btn u-caps">
            Add a piece
          </Link>
        </div>
      </main>
    </>
  );
}
