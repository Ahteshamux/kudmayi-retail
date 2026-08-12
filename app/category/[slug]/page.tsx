import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { ProductCard } from "@/components/ProductCard";
import { SectionLabel } from "@/components/SectionLabel";
import { categoryLabel, isCategorySlug } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  if (!isCategorySlug(slug)) notFound();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", slug)
    .order("created_at", { ascending: false });

  const products = (data ?? []) as Product[];

  return (
    <>
      <AppHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
        <Link
          href="/"
          className="u-caps text-muted hover:text-brass mb-8 inline-block transition-colors"
        >
          &larr; All collections
        </Link>

        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div className="min-w-0">
            <SectionLabel>
              {products.length} {products.length === 1 ? "piece" : "pieces"}
            </SectionLabel>
            <h1 className="font-display mt-4 text-4xl sm:text-5xl">
              {categoryLabel(slug)}
            </h1>
          </div>

          <Link href={`/product/new?category=${slug}`} className="u-btn u-caps">
            Add a piece
          </Link>
        </div>

        {error && (
          <p role="alert" className="text-rust text-sm">
            Couldn&rsquo;t load this collection: {error.message}
          </p>
        )}

        {!error && products.length === 0 ? (
          <div className="border-brass/15 border border-dashed p-14 text-center">
            <p className="text-muted">
              Nothing in {categoryLabel(slug)} yet.
            </p>
            <Link
              href={`/product/new?category=${slug}`}
              className="u-caps text-brass mt-4 inline-block hover:underline"
            >
              Add the first one
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
