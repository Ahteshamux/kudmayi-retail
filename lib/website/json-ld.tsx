import type { Product } from "@/lib/website/products";
import type { ShopCategorySlug } from "@/lib/website/categories";
import { CONTACT_EMAIL, INSTAGRAM_URL, SITE_URL,
  GOOGLE_MAPS_URL,} from "@/lib/website/constants";
import { shopCategoryLabel } from "@/lib/website/categories";
import { PHONE_HREF } from "@/lib/website/whatsapp";

/* ------------------------------------------------------------------ */
/*  Generic JSON-LD renderer                                          */
/* ------------------------------------------------------------------ */

/**
 * Renders a JSON-LD `<script>` tag. Drop this anywhere in a Server
 * Component and Next.js will hoist it into `<head>`.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Organization — shown on every public page via the website layout   */
/* ------------------------------------------------------------------ */

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kudmayi",
    url: SITE_URL,
    logo: `${SITE_URL}/icons/logo-512.png`,
    description:
      "Kudmayi — Pakistani menswear and weddingwear house. Sherwanis, prince coats, waistcoats, kurtas, and bespoke tailoring, crafted for the occasion.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      // E.164 with the leading "+", which is what schema.org expects.
      telephone: PHONE_HREF,
      email: CONTACT_EMAIL,
      availableLanguage: ["English", "Urdu"],
    },
    sameAs: [INSTAGRAM_URL, GOOGLE_MAPS_URL],
  };
}

/* ------------------------------------------------------------------ */
/*  WebSite — enables sitelinks search box in Google SERPs             */
/* ------------------------------------------------------------------ */

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kudmayi",
    url: SITE_URL,
  };
}

/* ------------------------------------------------------------------ */
/*  BreadcrumbList — renders breadcrumb trails in SERPs                */
/* ------------------------------------------------------------------ */

export function breadcrumbJsonLd(
  items: { name: string; url?: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

/* ------------------------------------------------------------------ */
/*  Product — the big one for e-commerce rich results                  */
/* ------------------------------------------------------------------ */

export function productJsonLd(product: Product) {
  const url = `${SITE_URL}/product/${product.slug}`;
  const price = product.salePriceRupees ?? product.priceRupees;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    url,
    /*
     * Deduplicated: a product with a single photo has image and hoverImage
     * pointing at the same file, and listing one URL twice tells Google the
     * product has two images when it has one.
     */
    image: [...new Set([product.image.src, product.hoverImage.src])],
    description:
      product.description ??
      `${product.name} — ${shopCategoryLabel(product.category).toLowerCase()} from Kudmayi. Hand-finished Pakistani menswear crafted for the occasion.`,
    color: product.colorName,
    brand: {
      "@type": "Brand",
      name: "Kudmayi",
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "PKR",
      price,
      /*
       * No priceValidUntil. It used to be emitted for sale items as
       * "build time + 30 days", which is a date nobody chose: product
       * pages are statically generated, so it was frozen at build, and on
       * a build older than a month it advertised a sale that had already
       * expired. The field is optional, and omitting it is honest where
       * inventing it is not. Emit a real value here once the schema
       * carries an actual sale end date.
       */
      availability: product.readyToShip
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Kudmayi",
      },
    },
  };
}

/* ------------------------------------------------------------------ */
/*  ItemList — for category / collection pages                         */
/* ------------------------------------------------------------------ */

export function itemListJsonLd(
  category: ShopCategorySlug,
  products: Product[],
) {
  const label = shopCategoryLabel(category);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${label} — Kudmayi`,
    url: `${SITE_URL}/shop/${category}`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/product/${p.slug}`,
      name: p.name,
    })),
  };
}
