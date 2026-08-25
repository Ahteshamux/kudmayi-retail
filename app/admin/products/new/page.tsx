import Link from "next/link";
import { createProduct } from "../actions";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductsAdminHeader } from "@/components/admin/ProductsAdminHeader";
import { isCategorySlug } from "@/lib/categories";
import { getDb } from "@/lib/db/client";
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

  const prefill =
    typeof fromRetail === "string" ? await loadRetailPrefill(fromRetail) : null;

  return (
    <>
      <ProductsAdminHeader />
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

        {!getDb() && (
          <p className="text-rust mb-8 max-w-lg text-sm">
            The database isn&rsquo;t connected yet — see the setup notes on the product list
            page before adding anything here.
          </p>
        )}

        <ProductForm
          action={createProduct}
          prefill={prefill ?? undefined}
          defaultCategory={defaultCategory}
          submitLabel="Save product"
          cancelHref="/admin/products"
        />
      </main>
    </>
  );
}
