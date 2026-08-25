import type { ShopCategorySlug } from "./categories";

/**
 * Editorial copy shared across every product in a category — the
 * craft/heritage paragraph, plus the bits needed to build a
 * product-specific second paragraph and a sensible size run. Real
 * per-product copy (Phase 3+) will override this; until then every
 * product in a category reads consistently rather than needing 40
 * hand-written paragraphs.
 */
export const CATEGORY_CRAFT_STORY: Record<ShopCategorySlug, string> = {
  sherwanis:
    "Hand-embroidery on sherwanis traces back to the royal ateliers of the Mughal and Rajput courts, where master artisans worked gold and silver thread into scrolling motifs across silk and velvet. Each thread was folded and couched by hand — a technique carried forward today by the same families of karigars who trained under their fathers and grandfathers. It remains one of the most labour-intensive crafts in South Asian tailoring, often taking weeks to complete a single panel.",
  "prince-coats":
    "The bandhgala — structured, high-collared, closed at the throat — descends from the formal coats worn in the Rajput and princely courts of Jodhpur and Jaipur. Its silhouette was built for ceremony: upright, disciplined, unmistakably formal. Kudmayi keeps that original tailoring intact, built on a canvas-interlined chest and a hand-finished collar that holds its shape through a full day of wear.",
  waistcoats:
    "The waistcoat entered South Asian formalwear through the Nehru-era reworking of Western tailoring — a layering piece built for warmth without bulk, worn open under a sherwani or closed on its own for daytime formal occasions. Ours are cut close through the body and finished with hand-stitched edges, so they sit flat under a jacket rather than adding weight to the silhouette.",
  kurtas:
    "The kurta is the most enduring piece in South Asian menswear — a straight-cut tunic that has moved, largely unchanged in form, from everyday wear to formal occasion wear over centuries. What changes is the fabric and the finish: raw silk and cotton silk for evening wear, breathable cotton and linen for daytime. Kudmayi's kurtas are cut with a slightly tapered body and finished with a mother-of-pearl button placket.",
  suits:
    "Western tailoring arrived in South Asia through colonial-era cantonment tailors, and the three-piece suit has stayed a formal-wear staple ever since — reinterpreted season after season but rarely improved on. Kudmayi's suits are half-canvassed for structure that moves with the body rather than against it, cut to a contemporary silhouette without losing the formality the occasion calls for.",
};

const SECOND_PARAGRAPH_DETAIL: Record<ShopCategorySlug, string> = {
  sherwanis: "cut for the aisle and finished by hand from collar to hem",
  "prince-coats": "structured through the chest and finished with a hand-set collar",
  waistcoats: "finished with hand-stitched edges to sit flat under a sherwani or coat",
  kurtas: "tapered through the body and finished with a mother-of-pearl button placket",
  suits: "half-canvassed through the chest for a silhouette that holds its shape",
};

export function productStoryParagraph(
  name: string,
  category: ShopCategorySlug,
  colorName: string,
  readyToShip: boolean,
): string {
  const detail = SECOND_PARAGRAPH_DETAIL[category];
  const availability = readyToShip
    ? "It's ready to ship, or"
    : "It's made to order — allow three to four weeks — and";
  return `Our ${name} is worked in ${colorName.toLowerCase()}, ${detail}. ${availability} can be fully customised through our bespoke service.`;
}

const STANDARD_SIZES = ["S", "M", "L", "XL", "XXL"];

/**
 * Default size run when a product doesn't set its own — same standard run
 * for every category, sherwanis through suits. Admin can still type
 * anything else (e.g. chest sizes) into a product's own Sizes field; this
 * is only the fallback.
 */
export function sizesForCategory(): string[] {
  return STANDARD_SIZES;
}
