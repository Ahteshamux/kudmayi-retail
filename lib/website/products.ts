import { and, desc, eq } from "drizzle-orm";
import type { ShopCategorySlug } from "./categories";
import type { PlaceholderImage } from "./placeholder-images";
import { getDb } from "@/lib/db/client";
import type { StorefrontProductImageRow, StorefrontProductRow } from "@/lib/db/schema";
import { storefrontProducts } from "@/lib/db/schema";

const UNSPLASH = "https://images.unsplash.com";
function unsplash(photoId: string, width: number): string {
  return `${UNSPLASH}/photo-${photoId}?auto=format&fit=crop&w=${width}&q=80`;
}

export type Product = {
  slug: string;
  name: string;
  category: ShopCategorySlug;
  priceRupees: number;
  /** Set only when the piece is discounted; always < priceRupees. */
  salePriceRupees: number | null;
  readyToShip: boolean;
  colorName: string;
  colorHex: string;
  /** null/empty means "no real copy yet" — the product page falls back to
   *  generated category copy (see lib/website/category-copy.ts). */
  description: string | null;
  /** Empty means "no real sizes set" — the product page falls back to
   *  sizesForCategory(). */
  sizes: string[];
  /** Freeform merchandising labels — "New Arrival", "Bestseller" — shown
   *  as badges, separate from the Ready to Ship badge. */
  tags: string[];
  /** Admin's "Featured (Groom Edit)" toggle — drives the homepage rail.
   *  See lib/website/featured-products.ts. */
  featured: boolean;
  image: PlaceholderImage;
  hoverImage: PlaceholderImage;
};

/**
 * The placeholder catalog — used as seed data (see
 * supabase/storefront-seed.sql) and as the fallback every query below
 * returns to when the real database isn't configured yet, is empty, or is
 * unreachable. The public site never 500s over this; see getDb()'s doc
 * comment for the reasoning.
 */
const RAW: Omit<Product, "hoverImage" | "description" | "sizes" | "salePriceRupees" | "tags" | "featured">[] = [
  // Sherwanis
  { slug: "ivory-embroidered-sherwani", name: "Ivory Embroidered Sherwani", category: "sherwanis", priceRupees: 145000, readyToShip: true, colorName: "Ivory", colorHex: "#f3ecdf", image: { src: unsplash("1759906766080-82b785c61f51", 900), alt: "Groom in traditional Indian wedding sherwani" } },
  { slug: "pearl-zardozi-sherwani", name: "Pearl Zardozi Sherwani", category: "sherwanis", priceRupees: 152000, readyToShip: false, colorName: "Pearl", colorHex: "#ede6d6", image: { src: unsplash("1729347917808-e3e35a462fec", 900), alt: "Man in a white embroidered sherwani" } },
  { slug: "emerald-silk-sherwani", name: "Emerald Silk Sherwani", category: "sherwanis", priceRupees: 148000, readyToShip: true, colorName: "Emerald", colorHex: "#145a32", image: { src: unsplash("1783188223691-8a233ee51cd8", 900), alt: "White embroidered Indian sherwani detail" } },
  { slug: "royal-blue-brocade-sherwani", name: "Royal Blue Brocade Sherwani", category: "sherwanis", priceRupees: 156000, readyToShip: false, colorName: "Royal Blue", colorHex: "#1e3a8a", image: { src: unsplash("1785613590152-63d713bc94b4", 900), alt: "Man in a blue sherwani posing by a decorated car" } },
  { slug: "ivory-silk-sherwani-with-dupatta", name: "Ivory Silk Sherwani with Dupatta", category: "sherwanis", priceRupees: 162000, readyToShip: true, colorName: "Ivory", colorHex: "#f3ecdf", image: { src: unsplash("1760080838961-4208536db385", 900), alt: "Groom in a white embroidered sherwani with a red turban and scarf" } },
  { slug: "champagne-raw-silk-sherwani", name: "Champagne Raw Silk Sherwani", category: "sherwanis", priceRupees: 139000, readyToShip: false, colorName: "Champagne", colorHex: "#d8c9a3", image: { src: unsplash("1762709413447-15781dbc08f7", 900), alt: "Groom in traditional Indian wedding attire outdoors" } },
  { slug: "midnight-wedding-sherwani", name: "Midnight Wedding Sherwani", category: "sherwanis", priceRupees: 158000, readyToShip: true, colorName: "Midnight", colorHex: "#1b1f3b", image: { src: unsplash("1785613590113-b974835a0090", 900), alt: "Man in a blue sherwani standing by a decorated black car" } },
  { slug: "stone-grey-formal-sherwani", name: "Stone Grey Formal Sherwani", category: "sherwanis", priceRupees: 144000, readyToShip: false, colorName: "Stone Grey", colorHex: "#8a8578", image: { src: unsplash("1781106784087-d6f4432ad721", 900), alt: "Man in traditional sherwani attire standing on a rooftop" } },

  // Prince Coats
  { slug: "black-velvet-prince-coat", name: "Black Velvet Prince Coat", category: "prince-coats", priceRupees: 128000, readyToShip: true, colorName: "Black", colorHex: "#171410", image: { src: unsplash("1755889767241-5ec60ce9506f", 900), alt: "Man in a tailored bandhgala jacket posing against a floral backdrop" } },
  { slug: "charcoal-bandhgala", name: "Charcoal Bandhgala", category: "prince-coats", priceRupees: 118000, readyToShip: false, colorName: "Charcoal", colorHex: "#2e2a26", image: { src: unsplash("1755889802350-f44895a3f710", 900), alt: "Man in traditional attire standing in a hallway" } },
  { slug: "wine-nehru-jacket", name: "Wine Nehru Jacket", category: "prince-coats", priceRupees: 112000, readyToShip: true, colorName: "Wine", colorHex: "#5c1a2b", image: { src: unsplash("1767775498862-d4740ce574ce", 900), alt: "Man in a bandhgala-style jacket walking outdoors" } },
  { slug: "olive-silk-prince-coat", name: "Olive Silk Prince Coat", category: "prince-coats", priceRupees: 122000, readyToShip: false, colorName: "Olive", colorHex: "#556b2f", image: { src: unsplash("1750785761104-3db8b016b0b2", 900), alt: "Man wearing traditional Pakistani formal attire" } },
  { slug: "maroon-zardozi-bandhgala", name: "Maroon Zardozi Bandhgala", category: "prince-coats", priceRupees: 135000, readyToShip: true, colorName: "Maroon", colorHex: "#6b1e23", image: { src: unsplash("1783923134973-d8769979ecb0", 900), alt: "Young man in an embroidered jacket" } },
  { slug: "sage-green-prince-coat", name: "Sage Green Prince Coat", category: "prince-coats", priceRupees: 115000, readyToShip: false, colorName: "Sage Green", colorHex: "#87a96b", image: { src: unsplash("1770392988936-dc3d8581e0c9", 900), alt: "Young man wearing traditional Indian attire in a field" } },
  { slug: "blush-pink-sherwani-coat", name: "Blush Pink Sherwani Coat", category: "prince-coats", priceRupees: 125000, readyToShip: true, colorName: "Blush Pink", colorHex: "#e8c4c4", image: { src: unsplash("1774267230654-ad5335ecd6f0", 900), alt: "Man in a pink kurta and jacket" } },
  { slug: "espresso-formal-coat", name: "Espresso Formal Coat", category: "prince-coats", priceRupees: 108000, readyToShip: false, colorName: "Espresso", colorHex: "#3b2a1d", image: { src: unsplash("1599725728598-dc7ed109ff89", 900), alt: "Man in a black formal jacket" } },

  // Waistcoats
  { slug: "deep-brown-waistcoat", name: "Deep Brown Waistcoat", category: "waistcoats", priceRupees: 38000, readyToShip: true, colorName: "Deep Brown", colorHex: "#4a3220", image: { src: unsplash("1782789086573-77dac305065e", 900), alt: "Stylish man buttoning a black waistcoat indoors" } },
  { slug: "navy-pinstripe-waistcoat", name: "Navy Pinstripe Waistcoat", category: "waistcoats", priceRupees: 34000, readyToShip: false, colorName: "Navy", colorHex: "#1f2a44", image: { src: unsplash("1632226390535-2f02c1a93541", 900), alt: "Man in a waistcoat and tie posing" } },
  { slug: "charcoal-formal-waistcoat", name: "Charcoal Formal Waistcoat", category: "waistcoats", priceRupees: 32000, readyToShip: true, colorName: "Charcoal", colorHex: "#2e2a26", image: { src: unsplash("1504791635568-fa4993808e0a", 900), alt: "Man carrying a jacket, wearing a waistcoat" } },
  { slug: "lilac-embellished-waistcoat", name: "Lilac Embellished Waistcoat", category: "waistcoats", priceRupees: 41000, readyToShip: false, colorName: "Lilac", colorHex: "#c8b6e2", image: { src: unsplash("1774267230662-575d1f4ec1bd", 900), alt: "Man in a light purple kurta and embellished vest" } },
  { slug: "crimson-silk-waistcoat", name: "Crimson Silk Waistcoat", category: "waistcoats", priceRupees: 36000, readyToShip: true, colorName: "Crimson", colorHex: "#a32638", image: { src: unsplash("1653666866518-d01fabfa94c2", 900), alt: "Man in a red vest and white shirt" } },
  { slug: "black-satin-waistcoat", name: "Black Satin Waistcoat", category: "waistcoats", priceRupees: 33000, readyToShip: false, colorName: "Black", colorHex: "#171410", image: { src: unsplash("1509112756314-34a0badb29d4", 900), alt: "Man standing in a suit and waistcoat" } },
  { slug: "grey-herringbone-waistcoat", name: "Grey Herringbone Waistcoat", category: "waistcoats", priceRupees: 35000, readyToShip: true, colorName: "Grey", colorHex: "#6e6e6e", image: { src: unsplash("1662833595899-07c57d617f56", 900), alt: "Man with a beard wearing a waistcoat and tie" } },
  { slug: "espresso-tweed-waistcoat", name: "Espresso Tweed Waistcoat", category: "waistcoats", priceRupees: 37000, readyToShip: false, colorName: "Espresso", colorHex: "#3b2a1d", image: { src: unsplash("1653747066349-f80664773758", 900), alt: "Man in a waistcoat and tie standing next to a wall" } },

  // Kurtas
  { slug: "cream-silk-kurta", name: "Cream Silk Kurta", category: "kurtas", priceRupees: 42000, readyToShip: true, colorName: "Cream", colorHex: "#f0e6d2", image: { src: unsplash("1723051948247-01e16b6a1481", 900), alt: "Man in a light-coloured kurta on stone steps" } },
  { slug: "ivory-cotton-kurta", name: "Ivory Cotton Kurta", category: "kurtas", priceRupees: 28000, readyToShip: false, colorName: "Ivory", colorHex: "#f3ecdf", image: { src: unsplash("1723051963745-d10d43248655", 900), alt: "Man in a light kurta standing on steps" } },
  { slug: "stone-white-kurta", name: "Stone White Kurta", category: "kurtas", priceRupees: 31000, readyToShip: true, colorName: "Stone White", colorHex: "#e4dcc8", image: { src: unsplash("1755931446696-a56fcfac1244", 900), alt: "Man in a white kurta standing against a stone wall" } },
  { slug: "black-formal-kurta", name: "Black Formal Kurta", category: "kurtas", priceRupees: 30000, readyToShip: false, colorName: "Black", colorHex: "#171410", image: { src: unsplash("1711045011143-360364323f93", 900), alt: "Man wearing a black traditional kurta" } },
  { slug: "charcoal-eid-kurta", name: "Charcoal Eid Kurta", category: "kurtas", priceRupees: 33000, readyToShip: true, colorName: "Charcoal", colorHex: "#2e2a26", image: { src: unsplash("1626967823200-fc462e636ec1", 900), alt: "Man in a black kurta" } },
  { slug: "sage-green-kurta", name: "Sage Green Kurta", category: "kurtas", priceRupees: 29000, readyToShip: false, colorName: "Sage Green", colorHex: "#87a96b", image: { src: unsplash("1767796704750-d685fb2a2143", 900), alt: "Man wearing a green kurta" } },
  { slug: "off-white-linen-kurta", name: "Off-White Linen Kurta", category: "kurtas", priceRupees: 27000, readyToShip: true, colorName: "Off-White", colorHex: "#edeae0", image: { src: unsplash("1720588713961-1191dd34e23e", 900), alt: "Man in a white kurta sitting on steps" } },
  { slug: "warm-grey-kurta", name: "Warm Grey Kurta", category: "kurtas", priceRupees: 30000, readyToShip: false, colorName: "Warm Grey", colorHex: "#8c8577", image: { src: unsplash("1686076685409-1340a2807a64", 900), alt: "Man with a beard standing in front of a building" } },

  // Suits
  { slug: "slate-grey-three-piece-suit", name: "Slate Grey Three-Piece Suit", category: "suits", priceRupees: 165000, readyToShip: true, colorName: "Slate Grey", colorHex: "#708090", image: { src: unsplash("1609840170480-4c440bcd5d8f", 900), alt: "Man in a grey suit jacket standing on a white staircase" } },
  { slug: "navy-blue-formal-suit", name: "Navy Blue Formal Suit", category: "suits", priceRupees: 152000, readyToShip: false, colorName: "Navy Blue", colorHex: "#1f2a44", image: { src: unsplash("1617137984095-74e4e5e3613f", 900), alt: "Man in a blue suit standing" } },
  { slug: "charcoal-two-piece-suit", name: "Charcoal Two-Piece Suit", category: "suits", priceRupees: 148000, readyToShip: true, colorName: "Charcoal", colorHex: "#2e2a26", image: { src: unsplash("1631052066165-9720608b36da", 900), alt: "Man in a black suit jacket sitting on a bench" } },
  { slug: "midnight-blue-suit", name: "Midnight Blue Suit", category: "suits", priceRupees: 158000, readyToShip: false, colorName: "Midnight Blue", colorHex: "#1b1f3b", image: { src: unsplash("1593032465175-481ac7f401a0", 900), alt: "Man in a blue suit jacket and black pants" } },
  { slug: "steel-blue-formal-suit", name: "Steel Blue Formal Suit", category: "suits", priceRupees: 150000, readyToShip: true, colorName: "Steel Blue", colorHex: "#4682b4", image: { src: unsplash("1594938298603-c8148c4dae35", 900), alt: "Man in a blue suit jacket" } },
  { slug: "black-tailored-suit", name: "Black Tailored Suit", category: "suits", priceRupees: 162000, readyToShip: false, colorName: "Black", colorHex: "#171410", image: { src: unsplash("1594938328870-9623159c8c99", 900), alt: "Man in a blue suit jacket and black pants" } },
  { slug: "ash-grey-formal-suit", name: "Ash Grey Formal Suit", category: "suits", priceRupees: 145000, readyToShip: true, colorName: "Ash Grey", colorHex: "#b2beb5", image: { src: unsplash("1679101893304-045625840a94", 900), alt: "Man in a suit leaning against a brick wall" } },
  { slug: "onyx-black-three-piece-suit", name: "Onyx Black Three-Piece Suit", category: "suits", priceRupees: 168000, readyToShip: false, colorName: "Onyx Black", colorHex: "#0b0b0c", image: { src: unsplash("1631052065979-40ebfc981ec3", 900), alt: "Man in a black suit jacket standing on a white floor" } },
];

/** Every product gets an alt-image for the card hover — the next product
 * in the same category, wrapping around. Real product photography will
 * have its own dedicated angles; this just avoids every card reusing its
 * own cover shot as its own hover state. */
/** Which placeholder pieces stand in for the Groom Edit rail in dev. */
const PLACEHOLDER_FEATURED_SLUGS = new Set([
  "ivory-embroidered-sherwani",
  "black-velvet-prince-coat",
  "cream-silk-kurta",
  "charcoal-bandhgala",
  "deep-brown-waistcoat",
  "slate-grey-three-piece-suit",
]);

export const PLACEHOLDER_PRODUCTS: Product[] = RAW.map((product) => {
  const sameCategory = RAW.filter((p) => p.category === product.category);
  const idx = sameCategory.findIndex((p) => p.slug === product.slug);
  const next = sameCategory[(idx + 1) % sameCategory.length];
  return {
    ...product,
    description: null,
    sizes: [],
    salePriceRupees: null,
    tags: [],
    featured: PLACEHOLDER_FEATURED_SLUGS.has(product.slug),
    hoverImage: next.image,
  };
});

// effectivePriceRupees moved to lib/website/pricing.ts — Client Components
// need it, and importing anything runtime from this file pulls in
// lib/db/client.ts's `postgres` package (Node-only) and fails to build.

/**
 * Placeholder data is a DEVELOPMENT convenience, never a production
 * fallback.
 *
 * These are invented garments with invented prices and hotlinked Unsplash
 * photos. Serving them to real shoppers because the database happens to be
 * unreachable would publish a fake catalogue at fake prices — customers
 * could add them to a cart and send a WhatsApp order for a piece that
 * doesn't exist. An empty category is recoverable; a fabricated price is
 * not. So in production a database failure yields nothing, and the page
 * renders its real empty state.
 */
const ALLOW_PLACEHOLDERS = process.env.NODE_ENV !== "production";

function placeholderCatalog(): Product[] {
  return ALLOW_PLACEHOLDERS ? PLACEHOLDER_PRODUCTS : [];
}

function rowToProduct(
  row: StorefrontProductRow,
  images: StorefrontProductImageRow[],
): Product {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const cover = sorted[0];
  const hover = sorted[1] ?? cover;
  return {
    slug: row.slug,
    name: row.name,
    category: row.category as ShopCategorySlug,
    priceRupees: row.priceRupees,
    salePriceRupees: row.salePriceRupees,
    readyToShip: row.readyToShip,
    colorName: row.colorName,
    colorHex: row.colorHex,
    description: row.description,
    sizes: row.sizes,
    tags: row.tags,
    featured: row.featured,
    image: { src: cover?.publicUrl ?? "", alt: cover?.altText || row.name },
    hoverImage: { src: hover?.publicUrl ?? "", alt: hover?.altText || row.name },
  };
}

function logDbFallback(context: string, err: unknown) {
  // The message has to match what actually happens, which differs by
  // environment: production serves nothing rather than inventing a
  // catalogue (see ALLOW_PLACEHOLDERS). Claiming "serving the placeholder
  // catalog" in production would send someone hunting for placeholder data
  // that was never rendered.
  console.error(
    ALLOW_PLACEHOLDERS
      ? `[products] ${context} — database query failed; serving the placeholder catalog (development only):`
      : `[products] ${context} — database query failed; serving an EMPTY catalogue. The storefront is showing no products:`,
    err,
  );
}

/**
 * Every product across all categories, newest first. Falls back to the
 * placeholder catalog if the database isn't configured, is unreachable,
 * or (deliberately) if it's configured but empty — an empty live catalog
 * would otherwise render as a blank site instead of a working one before
 * anyone has added real products yet.
 */
export async function listAllProducts(): Promise<Product[]> {
  const db = getDb();
  if (!db) return placeholderCatalog();

  try {
    const rows = await db.query.storefrontProducts.findMany({
      where: eq(storefrontProducts.published, true),
      with: { images: { orderBy: (i, { asc }) => [asc(i.sortOrder)] } },
      orderBy: [desc(storefrontProducts.createdAt)],
    });
    if (rows.length === 0) return placeholderCatalog();
    return rows.map((r) => rowToProduct(r, r.images));
  } catch (err) {
    logDbFallback("listAllProducts", err);
    return placeholderCatalog();
  }
}

export async function getProductsByCategory(
  category: ShopCategorySlug,
): Promise<Product[]> {
  const db = getDb();
  if (!db) return placeholderCatalog().filter((p) => p.category === category);

  try {
    const rows = await db.query.storefrontProducts.findMany({
      where: and(
        eq(storefrontProducts.category, category),
        eq(storefrontProducts.published, true),
      ),
      with: { images: { orderBy: (i, { asc }) => [asc(i.sortOrder)] } },
      orderBy: [desc(storefrontProducts.createdAt)],
    });
    if (rows.length === 0) {
      return placeholderCatalog().filter((p) => p.category === category);
    }
    return rows.map((r) => rowToProduct(r, r.images));
  } catch (err) {
    logDbFallback("getProductsByCategory", err);
    return placeholderCatalog().filter((p) => p.category === category);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const db = getDb();
  if (!db) return placeholderCatalog().find((p) => p.slug === slug);

  try {
    const row = await db.query.storefrontProducts.findFirst({
      // `published` is part of the lookup, not a post-filter: without it
      // an unpublished draft stays fully readable to anyone who knows or
      // guesses its slug, even though it's absent from listings and the
      // sitemap.
      where: and(
        eq(storefrontProducts.slug, slug),
        eq(storefrontProducts.published, true),
      ),
      with: { images: { orderBy: (i, { asc }) => [asc(i.sortOrder)] } },
    });
    if (!row) return placeholderCatalog().find((p) => p.slug === slug);
    return rowToProduct(row, row.images);
  } catch (err) {
    logDbFallback("getProductBySlug", err);
    return placeholderCatalog().find((p) => p.slug === slug);
  }
}
