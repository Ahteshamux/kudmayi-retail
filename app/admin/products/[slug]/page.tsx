import Link from "next/link";
import { notFound } from "next/navigation";
import { updateProduct } from "../actions";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getDb } from "@/lib/db/client";
import type { ShopCategorySlug } from "@/lib/website/categories";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: PageProps<"/admin/products/[slug]">) {
  const { slug } = await params;
  const db = getDb();

  if (!db) {
    return (
      <>
        <AdminHeader current="/admin/products" />
        <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-14 sm:px-8">
          <p className="text-rust text-sm">
            The database isn&rsquo;t connected yet — see the setup notes on{" "}
            <Link href="/admin/products" className="underline">
              the product list page
            </Link>
            .
          </p>
        </main>
      </>
    );
  }

  const row = await db.query.storefrontProducts.findFirst({
    where: (p, { eq }) => eq(p.slug, slug),
    with: { images: { orderBy: (i, { asc }) => [asc(i.sortOrder)] } },
  });
  if (!row) notFound();

  return (
    <>
      <AdminHeader current="/admin/products" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:px-8">
        <Link
          href="/admin/products"
          className="u-caps text-muted hover:text-brass-deep mb-8 inline-block transition-colors"
        >
          &larr; All products
        </Link>

        <div className="mb-10 max-w-lg">
          <p className="u-caps text-brass-deep">Editing</p>
          <h1 className="font-display mt-4 text-3xl sm:text-4xl">{row.name}</h1>
        </div>

        <ProductForm
          action={updateProduct}
          product={{
            id: row.id,
            slug: row.slug,
            name: row.name,
            category: row.category as ShopCategorySlug,
            priceRupees: row.priceRupees,
            salePriceRupees: row.salePriceRupees,
            readyToShip: row.readyToShip,
            colorName: row.colorName,
            colorHex: row.colorHex,
            description: row.description,
            sizes: row.sizes,
            tags: row.tags,
            featured: row.featured,
            image: row.images[0]
              ? { src: row.images[0].publicUrl, alt: row.images[0].altText }
              : { src: "", alt: "" },
            hoverImage: row.images[1]
              ? { src: row.images[1].publicUrl, alt: row.images[1].altText }
              : { src: "", alt: "" },
            images: row.images.map((img) => ({
              storagePath: img.storagePath,
              publicUrl: img.publicUrl,
              altText: img.altText,
            })),
          }}
          submitLabel="Save changes"
          cancelHref="/admin/products"
        />
      </main>
    </>
  );
}
