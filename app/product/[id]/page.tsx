import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { AvailabilityBadge } from "@/components/AvailabilityBadge";
import { DeleteProductButton } from "@/components/DeleteProductButton";
import { ProductForm } from "@/components/ProductForm";
import { SectionLabel } from "@/components/SectionLabel";
import { SwatchTag } from "@/components/SwatchTag";
import { updateProduct } from "../actions";
import { categoryLabel } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
  searchParams,
}: PageProps<"/product/[id]">) {
  const { id } = await params;
  const { edit } = await searchParams;

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const product = data as Product;

  const backHref = `/category/${product.category}`;
  const isEditing = edit === "1";

  return (
    <>
      <AppHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
        <Link
          href={backHref}
          className="u-caps text-muted hover:text-brass-deep mb-8 inline-block transition-colors"
        >
          &larr; {categoryLabel(product.category)}
        </Link>

        {isEditing ? (
          <>
            <div className="mb-10 max-w-lg">
              <SectionLabel>Editing</SectionLabel>
              <h1 className="font-display mt-4 text-3xl sm:text-4xl">
                {product.name}
              </h1>
            </div>

            <ProductForm
              action={updateProduct}
              product={product}
              cancelHref={`/product/${product.id}`}
              submitLabel="Save changes"
            />
          </>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 md:gap-14">
            <div className="border-line bg-well relative aspect-[3/4] overflow-hidden border">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="text-muted/70 u-caps flex h-full items-center justify-center">
                  No photo
                </div>
              )}

              <div className="absolute bottom-5 left-0">
                <SwatchTag color={product.color} />
              </div>
            </div>

            <div>
              <SectionLabel>{categoryLabel(product.category)}</SectionLabel>

              <h1 className="font-display mt-5 text-4xl leading-tight sm:text-5xl">
                {product.name}
              </h1>

              <div className="mt-7">
                <AvailabilityBadge available={product.available} size="md" />
              </div>

              <dl className="border-line mt-10 space-y-5 border-t pt-8">
                <div className="flex justify-between gap-6">
                  <dt className="u-caps text-muted">Colour</dt>
                  <dd className="text-right">{product.color}</dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt className="u-caps text-muted">Category</dt>
                  <dd className="text-right">
                    {categoryLabel(product.category)}
                  </dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt className="u-caps text-muted">Added</dt>
                  <dd className="text-right">
                    {new Date(product.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </dd>
                </div>
              </dl>

              <div className="border-line mt-10 flex flex-wrap items-center gap-3 border-t pt-8">
                <Link
                  href={`/product/${product.id}?edit=1`}
                  className="u-btn u-caps"
                >
                  Edit
                </Link>
                <DeleteProductButton id={product.id} name={product.name} />
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
