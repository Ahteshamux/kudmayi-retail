/**
 * Plain slug list for every product in the placeholder catalog — used by
 * the sitemap generator, which can't import from products.ts because that
 * module pulls in the `postgres` driver (Node.js-only, can't be resolved
 * in an App Route context).
 *
 * Keep this in sync with the RAW array in products.ts. When the site
 * switches to a fully database-driven catalog, the sitemap should be
 * restructured to query the DB directly (via an API route or a dynamic
 * sitemap function running in the Node.js runtime).
 */
export const PRODUCT_SLUGS: string[] = [
  // Sherwanis
  "ivory-embroidered-sherwani",
  "pearl-zardozi-sherwani",
  "emerald-silk-sherwani",
  "royal-blue-brocade-sherwani",
  "ivory-silk-sherwani-with-dupatta",
  "champagne-raw-silk-sherwani",
  "midnight-wedding-sherwani",
  "stone-grey-formal-sherwani",

  // Prince Coats
  "black-velvet-prince-coat",
  "charcoal-bandhgala",
  "wine-nehru-jacket",
  "olive-silk-prince-coat",
  "maroon-zardozi-bandhgala",
  "sage-green-prince-coat",
  "blush-pink-sherwani-coat",
  "espresso-formal-coat",

  // Waistcoats
  "deep-brown-waistcoat",
  "navy-pinstripe-waistcoat",
  "charcoal-formal-waistcoat",
  "lilac-embellished-waistcoat",
  "crimson-silk-waistcoat",
  "black-satin-waistcoat",
  "grey-herringbone-waistcoat",
  "espresso-tweed-waistcoat",

  // Kurtas
  "cream-silk-kurta",
  "ivory-cotton-kurta",
  "stone-white-kurta",
  "black-formal-kurta",
  "charcoal-eid-kurta",
  "sage-green-kurta",
  "off-white-linen-kurta",
  "warm-grey-kurta",

  // Suits
  "slate-grey-three-piece-suit",
  "navy-blue-formal-suit",
  "charcoal-two-piece-suit",
  "midnight-blue-suit",
  "steel-blue-formal-suit",
  "black-tailored-suit",
  "ash-grey-formal-suit",
  "onyx-black-three-piece-suit",
];
