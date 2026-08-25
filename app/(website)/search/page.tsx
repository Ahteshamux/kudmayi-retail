import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/website/Breadcrumb";
import { ShopProductCard } from "@/components/website/ShopProductCard";
import { shopCategoryLabel } from "@/lib/website/categories";
import { listAllProducts, type Product } from "@/lib/website/products";

function matches(product: Product, query: string): boolean {
  const haystack = [
    product.name,
    product.colorName,
    shopCategoryLabel(product.category),
    ...product.tags,
  ]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

export async function generateMetadata({
  searchParams,
}: PageProps<"/search">): Promise<Metadata> {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  return { title: query ? `Search: ${query}` : "Search" };
}

/**
 * Real search over the full catalog — no client-side index or API route
 * needed, since the catalog is small enough to filter server-side on every
 * request. The header's search box (HeaderActions.tsx) is a plain GET form
 * that lands here; this page works the same with JS disabled.
 */
export default async function SearchPage({
  searchParams,
}: PageProps<"/search">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  const results = query ? (await listAllProducts()).filter((p) => matches(p, query)) : [];

  return (
    <div className="u-container pt-32 pb-24 sm:pt-40">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

      <h1 className="font-display mt-6 text-4xl sm:text-5xl">
        {query ? `Results for “${query}”` : "Search"}
      </h1>

      {!query ? (
        <form action="/search" method="get" className="mt-8 flex max-w-md gap-2">
          <input
            type="search"
            name="q"
            autoFocus
            placeholder="Search products…"
            className="u-field"
            aria-label="Search products"
          />
          <button type="submit" className="u-btn u-caps shrink-0">
            Search
          </button>
        </form>
      ) : results.length === 0 ? (
        <div className="mt-10">
          <p className="text-muted">
            Nothing matched “{query}”. Try a category name, colour, or piece name.
          </p>
          <Link href="/shop/sherwanis" className="u-btn u-caps mt-6 inline-flex">
            Browse the Shop
          </Link>
        </div>
      ) : (
        <>
          <p className="text-muted mt-3 text-sm">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {results.map((product) => (
              <ShopProductCard key={product.slug} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
