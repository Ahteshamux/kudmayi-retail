import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccordionItem } from "@/components/website/AccordionItem";
import { Breadcrumb } from "@/components/website/Breadcrumb";
import { ProductActions } from "@/components/website/ProductActions";
import { ProductGallery } from "@/components/website/ProductGallery";
import { ShareButton } from "@/components/website/ShareButton";
import { shopCategoryLabel } from "@/lib/website/categories";
import {
  CATEGORY_CRAFT_STORY,
  productStoryParagraph,
  sizesForCategory,
} from "@/lib/website/category-copy";
import { SITE_URL } from "@/lib/website/constants";
import { formatPKR } from "@/lib/website/format";
import {
  JsonLd,
  productJsonLd,
  breadcrumbJsonLd,
} from "@/lib/website/json-ld";
import { getProductBySlug, listAllProducts } from "@/lib/website/products";
import { whatsAppLink } from "@/lib/website/whatsapp";

export async function generateStaticParams() {
  const products = await listAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const categoryLabel = shopCategoryLabel(product.category);
  const price = product.salePriceRupees ?? product.priceRupees;
  const description = `${product.name} — hand-finished ${categoryLabel.toLowerCase()} from Kudmayi. ${formatPKR(price)}. ${product.readyToShip ? "Ready to ship across Pakistan." : "Made to order — allow 3–4 weeks."} Shop Kudmayi.`;
  const url = `${SITE_URL}/product/${product.slug}`;

  return {
    title: product.name,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: product.name,
      description,
      url,
      type: "website",
      images: [
        {
          url: product.image.src,
          alt: product.image.alt,
          width: 900,
          height: 1200,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [product.image.src],
    },
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const categoryLabel = shopCategoryLabel(product.category);
  const sizes = product.sizes.length > 0 ? product.sizes : sizesForCategory();

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Shop", url: `${SITE_URL}/shop/${product.category}` },
    { name: categoryLabel, url: `${SITE_URL}/shop/${product.category}` },
    { name: product.name },
  ];

  const descriptionParagraphs = product.description
    ? product.description.split(/\n{2,}/)
    : [
        CATEGORY_CRAFT_STORY[product.category],
        productStoryParagraph(
          product.name,
          product.category,
          product.colorName,
          product.readyToShip,
        ),
      ];

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />

      <div className="u-container pt-32 pb-24 sm:pt-40">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop" },
          { label: categoryLabel, href: `/shop/${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery
          images={[product.image, product.hoverImage]}
          productName={product.name}
        />

        <div className="lg:sticky lg:top-36 lg:self-start">
          <div className="flex items-start justify-between gap-4">
            <p className="text-brass-deep u-caps">Kudmayi</p>
            <ShareButton title={product.name} />
          </div>

          <h1 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
            {product.name}
          </h1>
          {product.salePriceRupees !== null ? (
            <p className="mt-3 text-xl">
              <span className="text-muted line-through">{formatPKR(product.priceRupees)}</span>{" "}
              <span className="text-rust">{formatPKR(product.salePriceRupees)}</span>
            </p>
          ) : (
            <p className="mt-3 text-xl">{formatPKR(product.priceRupees)}</p>
          )}

          {(product.salePriceRupees !== null || product.tags.length > 0) && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.salePriceRupees !== null && (
                <span className="bg-rust text-parchment u-caps px-2.5 py-1 text-[0.625rem]">
                  Sale
                </span>
              )}
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="border-line u-caps px-2.5 py-1 text-[0.625rem]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="text-muted mt-7 max-w-prose space-y-4 text-sm leading-relaxed">
            {descriptionParagraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8">
            <p className="u-caps text-muted">Colour: {product.colorName}</p>
            {/* A plain border on a near-white swatch (Ivory, Pearl, Cream…)
                would all but disappear against the parchment page — the
                muted-tone ring plus an inset hairline keeps every colour
                visible regardless of how light it is. */}
            <span className="border-muted mt-3 inline-flex h-9 w-9 items-center justify-center rounded-full border">
              <span
                className="h-7 w-7 rounded-full shadow-[inset_0_0_0_1px_rgba(23,20,16,0.15)]"
                style={{ backgroundColor: product.colorHex }}
                aria-hidden="true"
              />
            </span>
          </div>

          <ProductActions product={product} sizes={sizes} />

          <div className="mt-10">
            <AccordionItem title="Product Details">
              <ul className="space-y-1.5">
                <li>Category: {categoryLabel}</li>
                <li>Colour: {product.colorName}</li>
                <li>Fit: Tailored</li>
                <li>Care: Dry clean only</li>
                <li>Handmade — small variations in embroidery and finish are part of the piece, not a flaw.</li>
              </ul>
            </AccordionItem>

            <AccordionItem title="Contact Our Stylist">
              <p>
                Questions about sizing, fabric, or customisation? Message us
                directly and we&rsquo;ll get back to you.
              </p>
              <a
                href={whatsAppLink(
                  `Hi Kudmayi, I'd like to know more about the ${product.name}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brass-deep u-caps mt-3 inline-block hover:underline"
              >
                Chat on WhatsApp
              </a>
            </AccordionItem>

            <AccordionItem title="Delivery & Returns">
              <p>
                {product.readyToShip
                  ? "Ready-to-ship pieces are dispatched within 3–5 working days."
                  : "Made-to-order pieces are cut and finished within 3–4 weeks of confirmation."}{" "}
                Delivered across Pakistan, with international shipping available on
                request. Altered or made-to-order pieces are final sale; unaltered
                ready-to-ship pieces can be exchanged within 7 days of delivery.
              </p>
            </AccordionItem>

            <AccordionItem title="Disclaimer">
              <p>
                Every piece is finished by hand — colour, embroidery placement, and
                trim may vary slightly from the photographs shown. This is a mark
                of handcraft, not a defect.
              </p>
            </AccordionItem>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
