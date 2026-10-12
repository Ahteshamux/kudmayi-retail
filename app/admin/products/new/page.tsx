import { eq, ilike } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createProduct } from "../actions";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { isCategorySlug } from "@/lib/categories";
import { getDb } from "@/lib/db/client";
import { storefrontProducts } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { isShopCategorySlug } from "@/lib/website/categories";
import { mapRetailCategory } from "@/lib/website/retail-bridge";
import type { Product as RetailProduct } from "@/lib/types";

async function loadRetailPrefill(retailId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", retailId)
    .maybeSingle();
  if (!data) return null;

  const retail = data as RetailProduct;
  if (!isCategorySlug(retail.category)) return null;

  return {
    name: retail.name,
    category: mapRetailCategory(retail.category),
    colorName: retail.color,
    // Referencing the Retail photo directly rather than re-uploading it —
    // storagePath is set to the full URL (not a real bucket path) so the
    // uploader's delete-cleanup treats it as external/borrowed and never
    // tries to remove the Retail item's own file out from under it.
    images: retail.image_url
      ? [{ storagePath: retail.image_url, publicUrl: retail.image_url, altText: retail.name }]
      : [],
  };
}

export default async function NewProductPage({
  searchParams,
}: PageProps<"/admin/products/new">) {
  const { category, fromRetail } = await searchParams;
  const defaultCategory =
    typeof category === "string" && isShopCategorySlug(category) ? category : undefined;

  const retailId = typeof fromRetail === "string" ? fromRetail : null;
  const prefill = retailId ? await loadRetailPrefill(retailId) : null;

  /*
   * Publishing a Retail item that's already on the store opens that
   * listing instead of starting a duplicate. An older listing added by hand
   * isn't linked, so a same-name match is only flagged, not assumed.
   */
  const db = getDb();
  let sameName: { slug: string; name: string } | undefined;
  if (db && retailId && prefill) {
    const linked = await db.query.storefrontProducts.findFirst({
      where: eq(storefrontProducts.retailProductId, retailId),
    });
    if (linked) redirect(`/admin/products/${linked.slug}`);
    sameName = await db.query.storefrontProducts.findFirst({
      where: ilike(storefrontProducts.name, prefill.name),
      columns: { slug: true, name: true },
    });
  }

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
          <p className="u-caps text-brass-deep">
            {prefill ? "Publishing from Retail" : "New entry"}
          </p>
          <h1 className="font-display mt-4 text-3xl sm:text-4xl">Add a product</h1>
          {prefill && (
            <p className="text-muted mt-3 text-sm">
              Name, category, colour, and photo carried over from the Retail catalog —
              add the price, sizes, and description, then save.
            </p>
          )}
        </div>

        {sameName && (
          <p className="border-line bg-surface text-espresso mb-8 max-w-lg border p-4 text-sm">
            A store listing called &ldquo;{sameName.name}&rdquo; already exists.{" "}
            <Link href={`/admin/products/${sameName.slug}`} className="underline">
              Edit that one
            </Link>{" "}
            if it&rsquo;s the same piece — saving here adds a second listing.
          </p>
        )}

        {!db && (
          <p className="text-rust mb-8 max-w-lg text-sm">
            The database isn&rsquo;t connected yet — see the setup notes on the product list
            page before adding anything here.
          </p>
        )}

        <ProductForm
          action={createProduct}
          prefill={prefill ?? undefined}
          retailProductId={prefill ? (retailId ?? undefined) : undefined}
          defaultCategory={defaultCategory}
          submitLabel="Save product"
          cancelHref="/admin/products"
        />
      </main>
    </>
  );
}
