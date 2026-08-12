import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { ProductForm } from "@/components/ProductForm";
import { SectionLabel } from "@/components/SectionLabel";
import { createProduct } from "../actions";
import { isCategorySlug } from "@/lib/categories";

export default async function NewProductPage({
  searchParams,
}: PageProps<"/product/new">) {
  // Arriving from a collection page preselects that category.
  const { category } = await searchParams;
  const defaultCategory = isCategorySlug(category) ? category : undefined;
  const backHref = defaultCategory ? `/category/${defaultCategory}` : "/";

  return (
    <>
      <AppHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
        <Link
          href={backHref}
          className="u-caps text-muted hover:text-brass mb-8 inline-block transition-colors"
        >
          &larr; Back
        </Link>

        <div className="mb-10 max-w-lg">
          <SectionLabel>New entry</SectionLabel>
          <h1 className="font-display mt-4 text-3xl sm:text-4xl">
            Add a piece
          </h1>
        </div>

        <ProductForm
          action={createProduct}
          defaultCategory={defaultCategory}
          cancelHref={backHref}
          submitLabel="Save piece"
        />
      </main>
    </>
  );
}
