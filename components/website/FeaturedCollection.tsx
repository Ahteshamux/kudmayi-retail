import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";
import { getFeaturedProducts } from "@/lib/website/featured-products";

export async function FeaturedCollection() {
  const groomEdit = await getFeaturedProducts();

  return (
    <section id="groom-edit" aria-labelledby="groom-edit-heading" className="u-section">
      <div className="u-container">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6 lg:mb-14">
          <div>
            <p className="u-caps text-brass-deep">Featured</p>
            <h2 id="groom-edit-heading" className="font-display mt-4 text-3xl sm:text-4xl">
              The Groom Edit
            </h2>
            <p className="text-muted mt-3 max-w-md">
              Pieces built for the day itself.
            </p>
          </div>
          <Link
            href="#shop-by-category"
            className="u-caps text-muted hover:text-brass-deep transition-colors"
          >
            View All &rarr;
          </Link>
        </Reveal>
      </div>

      {/* Desktop: 4-up grid. Mobile: snap-scroll, next card peeking in. */}
      <div className="u-container hidden gap-x-6 gap-y-10 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {groomEdit.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:hidden">
        {groomEdit.map((product) => (
          <div key={product.slug} className="w-[78%] shrink-0 snap-center">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
