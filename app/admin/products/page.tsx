import Image from "next/image";
import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { ProductsAdminHeader } from "@/components/admin/ProductsAdminHeader";
import { getDb } from "@/lib/db/client";
import { SHOP_CATEGORIES, type ShopCategorySlug } from "@/lib/website/categories";
import { formatPKR } from "@/lib/website/format";
import type { StorefrontProductImageRow, StorefrontProductRow } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

type ProductWithImages = StorefrontProductRow & { images: StorefrontProductImageRow[] };

export default async function ProductsAdminPage() {
  const db = getDb();

  if (!db) {
    return (
      <>
        <ProductsAdminHeader />
        <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-14 sm:px-8">
          <SetupNotice />
        </main>
      </>
    );
  }

  const products = await db.query.storefrontProducts.findMany({
    with: { images: { orderBy: (i, { asc }) => [asc(i.sortOrder)] } },
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  });

  const byCategory = new Map<ShopCategorySlug, ProductWithImages[]>(
    SHOP_CATEGORIES.map((c) => [c.slug, []]),
  );
  for (const product of products) {
    byCategory.get(product.category as ShopCategorySlug)?.push(product);
  }

  return (
    <>
      <ProductsAdminHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="u-caps text-brass-deep">Storefront Catalog</p>
            <h1 className="font-display mt-4 text-3xl sm:text-4xl">
              {products.length} {products.length === 1 ? "product" : "products"}
            </h1>
          </div>
          <Link href="/admin/products/new" className="u-btn u-caps">
            Add Product
          </Link>
        </div>

        <div className="space-y-12">
          {SHOP_CATEGORIES.map((category) => {
            const items = byCategory.get(category.slug) ?? [];
            return (
              <section key={category.slug}>
                <div className="border-line mb-4 flex items-end justify-between gap-4 border-b pb-3">
                  <h2 className="font-display text-2xl">
                    {category.label}{" "}
                    <span className="text-muted text-base font-normal">({items.length})</span>
                  </h2>
                  <Link
                    href={`/admin/products/new?category=${category.slug}`}
                    className="u-caps text-muted hover:text-brass-deep transition-colors"
                  >
                    + Add
                  </Link>
                </div>

                {items.length === 0 ? (
                  <p className="text-muted text-sm">Nothing in {category.label} yet.</p>
                ) : (
                  <div className="divide-line divide-y">
                    {items.map((product) => (
                      <ProductRow key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </main>
    </>
  );
}

function ProductRow({ product }: { product: ProductWithImages }) {
  const cover = product.images[0];
  return (
    <div className="flex items-center gap-4 py-3">
      <div className="bg-well border-line relative h-16 w-12 shrink-0 overflow-hidden border">
        {cover ? (
          <Image src={cover.publicUrl} alt="" fill sizes="48px" className="object-cover" />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate">{product.name}</p>
        <p className="text-muted text-sm">
          {formatPKR(product.priceRupees)}
          {!product.published && " · Unpublished"}
          {product.featured && " · Featured"}
        </p>
      </div>

      <Link
        href={`/admin/products/${product.slug}`}
        className="u-caps text-muted hover:text-brass-deep px-2 py-1 transition-colors"
      >
        Edit
      </Link>

      <DeleteProductButton id={product.id} name={product.name} />
    </div>
  );
}

function SetupNotice() {
  return (
    <div className="border-line bg-surface border p-8">
      <p className="u-caps text-brass-deep">Setup needed</p>
      <h1 className="font-display mt-4 text-3xl">Database not connected yet.</h1>
      <ol className="text-muted mt-6 list-decimal space-y-3 pl-5 text-sm leading-relaxed">
        <li>
          Open <strong>Supabase → SQL Editor</strong>, paste the contents of{" "}
          <code className="bg-well px-1.5 py-0.5">supabase/storefront-setup.sql</code>, and run
          it. This creates the tables, storage bucket, and access policies.
        </li>
        <li>
          Get the connection string from{" "}
          <strong>Supabase → Project Settings → Database → Connection string</strong> (use the
          &ldquo;Transaction&rdquo; pooler mode) and add it to{" "}
          <code className="bg-well px-1.5 py-0.5">.env.local</code> as{" "}
          <code className="bg-well px-1.5 py-0.5">DATABASE_URL</code>. Never paste it anywhere
          else.
        </li>
        <li>
          Restart the dev server, then optionally run{" "}
          <code className="bg-well px-1.5 py-0.5">npm run seed-storefront</code> to load the
          placeholder catalog as real, editable products.
        </li>
      </ol>
    </div>
  );
}
