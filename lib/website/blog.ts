export const SHERWANI_MISTAKES_SLUG =
  "5-sherwani-mistakes-every-pakistani-groom-should-avoid";

export const LATEST_SHERWANI_DESIGNS_SLUG =
  "latest-sherwani-designs-pakistani-grooms-2026";

export const SHERWANI_VS_PRINCE_COAT_SLUG =
  "sherwani-vs-prince-coat-pakistani-groom";

export const NIKAH_DRESS_IDEAS_SLUG =
  "best-nikah-dress-ideas-pakistani-grooms";

export const WALIMA_GROOM_OUTFITS_SLUG =
  "walima-groom-outfits-sherwani-prince-coat-suit";

export type BlogPostSummary = {
  slug: string;
  href: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  displayDate: string;
  readingTime: string;
  image: {
    src: string;
    alt: string;
  };
  keywords: string[];
};

export type BlogProductImage = BlogPostSummary["image"] & {
  productName: string;
  productHref: string;
};

const PRODUCT_IMAGE_BASE =
  "https://jqmrtekhgspvvmgzuxvs.supabase.co/storage/v1/object/public";

/**
 * First-party Kudmayi catalogue photography. These exact files were verified
 * against the published product records on 2026-09-04. Keeping the product
 * link with each image lets every editorial photograph lead back to the piece
 * it actually shows.
 */
export const BLOG_PRODUCT_IMAGES = {
  chandni: {
    src: `${PRODUCT_IMAGE_BASE}/product-images/415a8281-abcf-467d-8c52-cbe5a4f236e3/f5fceba5-c30d-4c52-be40-de90c71618e7.jpg`,
    alt: "Kudmayi Chandni silver prince coat with dense tonal embroidery, styled with an ivory kurta and trousers.",
    productName: "Chandni",
    productHref: "/product/chandni",
  },
  darbar: {
    src: `${PRODUCT_IMAGE_BASE}/product-images/415a8281-abcf-467d-8c52-cbe5a4f236e3/c57dc4e3-5c08-4fe5-bbb0-669fb71e65de.jpg`,
    alt: "Kudmayi Darbar emerald prince coat with gold embroidery, worn over an ivory kurta and trousers.",
    productName: "Darbar",
    productHref: "/product/darbar",
  },
  noorESultan: {
    src: `${PRODUCT_IMAGE_BASE}/product-images/415a8281-abcf-467d-8c52-cbe5a4f236e3/4b01bed4-00ed-4d3f-beda-e8c9ad5d3a41.jpg`,
    alt: "Kudmayi Noor E Sultan antique-gold sherwani styled with a matching turban in a heritage interior.",
    productName: "Noor E Sultan",
    productHref: "/product/noor-e-sultan",
  },
  sangEMarmar: {
    src: `${PRODUCT_IMAGE_BASE}/product-images/415a8281-abcf-467d-8c52-cbe5a4f236e3/158c3066-a8b3-49cd-8454-c4fedfcdbb23.jpg`,
    alt: "Kudmayi Sang E Marmar silver-grey sherwani with geometric metallic embroidery.",
    productName: "Sang E Marmar",
    productHref: "/product/sang-e-marmar",
  },
  shabEAswad: {
    src: `${PRODUCT_IMAGE_BASE}/storefront-products/bead3817-22de-4f7b-b78d-ea04ff4c760c.jpg`,
    alt: "Kudmayi Shab E Aswad black sherwani with tonal beadwork and a black turban.",
    productName: "Shab E Aswad",
    productHref: "/product/shab-e-aswad",
  },
  zarrEShaan: {
    src: `${PRODUCT_IMAGE_BASE}/product-images/415a8281-abcf-467d-8c52-cbe5a4f236e3/bb1f3b06-c497-4a32-a6ba-ed9bbfe633e7.jpg`,
    alt: "Kudmayi Zarr E Shaan ivory-gold sherwani with tonal embroidery and a cream turban.",
    productName: "Zarr E Shaan",
    productHref: "/product/zarr-e-shaan",
  },
  shehnai: {
    src: `${PRODUCT_IMAGE_BASE}/product-images/415a8281-abcf-467d-8c52-cbe5a4f236e3/84288f52-7c3c-48be-8cf1-8f7a576c4a85.jpg`,
    alt: "Kudmayi Shehnai emerald velvet sherwani with gold motifs and an ivory turban.",
    productName: "Shehnai",
    productHref: "/product/shehnai",
  },
  mirza: {
    src: `${PRODUCT_IMAGE_BASE}/product-images/415a8281-abcf-467d-8c52-cbe5a4f236e3/82b39d25-89d0-4c14-b85b-c2e6d8ef542e.jpg`,
    alt: "Kudmayi Mirza warm camel prince coat with gold cuff and side embroidery.",
    productName: "Mirza",
    productHref: "/product/mirza",
  },
  sangEMaah: {
    src: `${PRODUCT_IMAGE_BASE}/storefront-products/67ae793a-fcb6-4c91-8abd-7237007f8176.jpg`,
    alt: "Kudmayi Sang E Maah taupe sherwani with repeated antique-gold motifs and tonal trousers.",
    productName: "Sang E Maah",
    productHref: "/product/sang-e-maah",
  },
  tajdaar: {
    src: `${PRODUCT_IMAGE_BASE}/product-images/415a8281-abcf-467d-8c52-cbe5a4f236e3/0b48dd33-9a5d-4b64-a926-66627e95237f.jpg`,
    alt: "Kudmayi Tajdaar black prince coat with tonal beadwork, styled with a black turban and brooch.",
    productName: "Tajdaar",
    productHref: "/product/tajdaar",
  },
} satisfies Record<string, BlogProductImage>;

export const NIKAH_DRESS_IDEAS_POST: BlogPostSummary = {
  slug: NIKAH_DRESS_IDEAS_SLUG,
  href: `/blog/${NIKAH_DRESS_IDEAS_SLUG}`,
  title: "7 Best Nikah Dress Ideas for Pakistani Grooms",
  description:
    "Explore seven Nikah dress ideas for Pakistani grooms, from ivory sherwanis and prince coats to simple kurta-waistcoat looks, with venue and season advice.",
  excerpt:
    "A Nikah outfit can be simple or ceremonial. These seven directions help you choose the right level of formality for the venue, season and bridal look.",
  category: "Nikah Style",
  publishedAt: "2026-09-05",
  updatedAt: "2026-09-05",
  displayDate: "September 5, 2026",
  readingTime: "9 min read",
  image: BLOG_PRODUCT_IMAGES.chandni,
  keywords: [
    "Nikah dress for groom",
    "Pakistani groom Nikah",
    "Nikah outfit ideas men",
    "groom prince coat",
    "Nikah sherwani",
  ],
};

export const WALIMA_GROOM_OUTFITS_POST: BlogPostSummary = {
  slug: WALIMA_GROOM_OUTFITS_SLUG,
  href: `/blog/${WALIMA_GROOM_OUTFITS_SLUG}`,
  title: "Walima Groom Outfits: Sherwani, Prince Coat or Suit?",
  description:
    "Compare sherwani, prince coat and suit options for a Pakistani groom's Walima, with practical advice for venue, season, colour, fit and rewear.",
  excerpt:
    "A suit is not compulsory for the Walima. Compare three valid directions and let the venue, season, bridal palette and desired level of tradition decide.",
  category: "Walima Style",
  publishedAt: "2026-09-05",
  updatedAt: "2026-09-05",
  displayDate: "September 5, 2026",
  readingTime: "9 min read",
  image: BLOG_PRODUCT_IMAGES.tajdaar,
  keywords: [
    "Walima groom outfit",
    "Walima dress for groom",
    "Walima prince coat",
    "Walima sherwani",
    "Walima suit for groom",
  ],
};

export const LATEST_SHERWANI_DESIGNS_POST: BlogPostSummary = {
  slug: LATEST_SHERWANI_DESIGNS_SLUG,
  href: `/blog/${LATEST_SHERWANI_DESIGNS_SLUG}`,
  title: "Latest Sherwani Designs for Pakistani Grooms in 2026",
  description:
    "See the latest sherwani designs for Pakistani grooms in 2026, with practical advice on colour, fabric, embroidery, silhouette and wedding events.",
  excerpt:
    "The strongest 2026 looks are not one single colour or cut. They combine a clean silhouette with controlled handwork, from ivory-gold and silver-grey to tonal black and emerald.",
  category: "2026 Groom Trends",
  publishedAt: "2026-09-04",
  updatedAt: "2026-09-04",
  displayDate: "September 4, 2026",
  readingTime: "9 min read",
  image: BLOG_PRODUCT_IMAGES.zarrEShaan,
  keywords: [
    "latest sherwani designs 2026",
    "Pakistani groom sherwani",
    "sherwani designs Pakistan",
    "groom wedding dress 2026",
    "modern sherwani colours",
  ],
};

export const SHERWANI_VS_PRINCE_COAT_POST: BlogPostSummary = {
  slug: SHERWANI_VS_PRINCE_COAT_SLUG,
  href: `/blog/${SHERWANI_VS_PRINCE_COAT_SLUG}`,
  title: "Sherwani vs Prince Coat: What Should a Pakistani Groom Wear?",
  description:
    "Compare a sherwani and prince coat by length, formality, wedding event, styling and rewear value before choosing your Pakistani groom outfit.",
  excerpt:
    "Choose a sherwani when the occasion calls for ceremony and presence. Choose a prince coat when you want a shorter, sharper silhouette for a Walima, reception or modern Nikah.",
  category: "Groom Style",
  publishedAt: "2026-09-04",
  updatedAt: "2026-09-04",
  displayDate: "September 4, 2026",
  readingTime: "8 min read",
  image: BLOG_PRODUCT_IMAGES.mirza,
  keywords: [
    "sherwani vs prince coat",
    "prince coat for groom",
    "Pakistani groom outfit",
    "Walima prince coat",
    "Barat sherwani",
  ],
};

export const SHERWANI_MISTAKES_POST: BlogPostSummary = {
  slug: SHERWANI_MISTAKES_SLUG,
  href: `/blog/${SHERWANI_MISTAKES_SLUG}`,
  title: "5 Sherwani Mistakes Every Pakistani Groom Should Avoid",
  description:
    "A practical guide to sherwani fit, colours, fabrics, embroidery and accessories for Pakistani grooms planning their wedding look.",
  excerpt:
    "The right order is fit, fabric, colour, then embroidery. These five checks help you make the important decisions before your first fitting.",
  category: "Groom Style",
  publishedAt: "2026-09-04",
  updatedAt: "2026-09-04",
  displayDate: "September 4, 2026",
  readingTime: "10 min read",
  image: BLOG_PRODUCT_IMAGES.noorESultan,
  keywords: [
    "sherwani mistakes",
    "Pakistani groom sherwani",
    "sherwani colours",
    "sherwani fitting",
    "groom style Pakistan",
  ],
};

export const BLOG_POSTS = [
  WALIMA_GROOM_OUTFITS_POST,
  NIKAH_DRESS_IDEAS_POST,
  LATEST_SHERWANI_DESIGNS_POST,
  SHERWANI_VS_PRINCE_COAT_POST,
  SHERWANI_MISTAKES_POST,
] as const;
