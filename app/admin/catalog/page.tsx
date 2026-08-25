import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { SectionLabel } from "@/components/SectionLabel";
import { CATEGORIES } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Four head-only count queries in parallel. The payload stays constant no
  // matter how big the catalog gets — pulling every row back just to count
  // them would grow the home screen's load time with the collection.
  //
  // Wrapped because a misconfigured or unreachable project makes these throw,
  // and the home screen should say so rather than show a crash page.
  let counts = new Map<string, number>();
  let errorMessage: string | null = null;

  try {
    const supabase = await createClient();
    const results = await Promise.all(
      CATEGORIES.map(async (category) => {
        const { count, error } = await supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("category", category.slug);
        return { slug: category.slug, count: count ?? 0, error };
      }),
    );

    counts = new Map(results.map((r) => [r.slug, r.count]));
    errorMessage = results.find((r) => r.error)?.error?.message ?? null;
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : String(err);
  }

  const total = [...counts.values()].reduce((sum, n) => sum + n, 0);

  return (
    <>
      <AppHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-14">
          <p className="u-caps text-brass-deep">The Collections</p>
          <h1 className="font-display mt-5 text-4xl leading-[1.15] sm:text-5xl">
            {total === 0
              ? "Your catalog starts here."
              : `${total} ${total === 1 ? "piece" : "pieces"} in the catalog.`}
          </h1>
        </div>

        {errorMessage && (
          <p role="alert" className="text-rust mb-8 text-sm">
            Couldn&rsquo;t load the catalog: {errorMessage}
          </p>
        )}

        <div className="grid gap-px sm:grid-cols-2">
          {CATEGORIES.map((category) => {
            const count = counts.get(category.slug) ?? 0;
            return (
              <Link
                key={category.slug}
                href={`/admin/catalog/category/${category.slug}`}
                className="group border-line hover:border-brass hover:bg-surface border p-7 transition-colors sm:p-9"
              >
                <SectionLabel>
                  {count} {count === 1 ? "piece" : "pieces"}
                </SectionLabel>

                <h2 className="font-display group-hover:text-brass-deep mt-5 text-3xl transition-colors sm:text-[2rem]">
                  {category.label}
                </h2>

                <span className="u-caps text-muted group-hover:text-brass-deep mt-6 inline-block transition-colors">
                  View &rarr;
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-12">
          <Link href="/admin/catalog/product/new" className="u-btn u-caps">
            Add a piece
          </Link>
        </div>
      </main>
    </>
  );
}
