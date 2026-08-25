import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { SHOP_CATEGORIES, type ShopCategorySlug } from "@/lib/website/categories";
import type { HomepageImages } from "@/lib/website/homepage-content";

export function CategorySection({ images }: { images: HomepageImages }) {
  return (
    <section id="shop-by-category" aria-labelledby="category-heading" className="u-section">
      <div className="u-container">
        <Reveal className="mb-10 lg:mb-14">
          <p className="u-caps text-brass-deep">The Collections</p>
          <h2 id="category-heading" className="font-display mt-4 text-3xl sm:text-4xl">
            Shop by Category
          </h2>
        </Reveal>
      </div>

      {/* Desktop/tablet: asymmetric grid — Sherwanis large, the rest in a
          2x2 block beside it. */}
      <div className="u-container hidden gap-2 md:grid md:h-[640px] md:grid-cols-4 md:grid-rows-2">
        <CategoryTile
          category={SHOP_CATEGORIES[0]}
          image={images[`category_${SHOP_CATEGORIES[0].slug}`]}
          className="col-span-2 row-span-2"
        />
        {SHOP_CATEGORIES.slice(1).map((category) => (
          <CategoryTile
            key={category.slug}
            category={category}
            image={images[`category_${category.slug}`]}
          />
        ))}
      </div>

      {/* Mobile: horizontal snap carousel — keeps the large-imagery feel
          instead of shrinking five cards into a column. */}
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:hidden">
        {SHOP_CATEGORIES.map((category) => (
          <div key={category.slug} className="min-w-[82%] shrink-0 snap-center">
            <CategoryTile
              category={category}
              image={images[`category_${category.slug}`]}
              className="aspect-[4/5]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function CategoryTile({
  category,
  image,
  className = "",
}: {
  category: { slug: ShopCategorySlug; label: string };
  image: { src: string; alt: string };
  className?: string;
}) {
  return (
    <Link
      href={`/shop/${category.slug}`}
      className={`group relative block overflow-hidden ${className}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(max-width: 767px) 82vw, (max-width: 1023px) 25vw, 20vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span className="u-caps bg-black/25 text-parchment absolute bottom-4 left-4 px-3 py-1.5">
        {category.label}
      </span>
    </Link>
  );
}
