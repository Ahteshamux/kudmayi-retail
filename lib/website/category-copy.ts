import { isAccessoryCategory, type ShopCategorySlug } from "./categories";

/** The groom's own size guide is adult measurements, so it's only for these. */
export function hasAdultSizeGuide(category: ShopCategorySlug): boolean {
  return !isAccessoryCategory(category) && category !== "sarbala";
}

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
  sarbala:
    "At a Pakistani wedding the groom never walks alone. The sarbala, usually a younger brother, nephew or cousin, stays at his side through the day, and by custom he dresses to match. His outfit echoes the groom's, scaled down for a boy, so the two read as one party in every photograph.",
  turbans:
    "The turban has crowned the South Asian groom for centuries — a mark of honour and ceremony long before it was a wedding tradition. Its shape, fold and colour have always spoken for the occasion, and it remains the piece that finishes a sherwani or prince coat and turns an outfit into a groom's look.",
  "groom-footwear":
    "The khussa is the traditional slip-on shoe of Punjab, worn at Mughal-era courts and still the groom's choice today. Its closed, pointed shape and decorated upper are made to be seen beneath a sherwani, and it completes the outfit in a way a Western dress shoe never quite does.",
  suits:
    "Western tailoring arrived in South Asia through colonial-era cantonment tailors, and the three-piece suit has stayed a formal-wear staple ever since — reinterpreted season after season but rarely improved on. Kudmayi's suits are half-canvassed for structure that moves with the body rather than against it, cut to a contemporary silhouette without losing the formality the occasion calls for.",
};

const SECOND_PARAGRAPH_DETAIL: Record<ShopCategorySlug, string> = {
  sherwanis: "cut for the aisle and finished by hand from collar to hem",
  "prince-coats": "structured through the chest and finished with a hand-set collar",
  waistcoats: "finished with hand-stitched edges to sit flat under a sherwani or coat",
  kurtas: "tapered through the body and finished with a mother-of-pearl button placket",
  suits: "half-canvassed through the chest for a silhouette that holds its shape",
  sarbala: "cut to echo the groom's look",
  turbans: "made to finish a sherwani or prince coat",
  "groom-footwear": "made to be worn beneath a sherwani on the day",
};

export function productStoryParagraph(
  name: string,
  category: ShopCategorySlug,
  colorName: string,
  readyToShip: boolean,
): string {
  const detail = SECOND_PARAGRAPH_DETAIL[category];
  if (isAccessoryCategory(category) || category === "sarbala") {
    const when = readyToShip ? "It's ready to ship." : "It's made to order — allow three to four weeks.";
    return `Our ${name} is worked in ${colorName.toLowerCase()}, ${detail}. ${when}`;
  }
  const availability = readyToShip
    ? "It's ready to ship, or"
    : "It's made to order — allow three to four weeks — and";
  return `Our ${name} is worked in ${colorName.toLowerCase()}, ${detail}. ${availability} can be fully customised through our bespoke service.`;
}

const STANDARD_SIZES = ["S", "M", "L", "XL", "XXL"];
const FOOTWEAR_SIZES = ["39", "40", "41", "42", "43", "44", "45"];
const SARBALA_SIZES = ["2-3 Y", "4-5 Y", "6-7 Y", "8-9 Y", "10-12 Y"];

/**
 * Default size run when a product doesn't set its own. Clothing shares one
 * run, sarbala goes by age, footwear uses shoe sizes, and turbans have none (empty means no size
 * picker on the product page). Admin can still type anything else into a
 * product's own Sizes field; this is only the fallback.
 */
export function sizesForCategory(category: ShopCategorySlug): string[] {
  if (category === "turbans") return [];
  if (category === "groom-footwear") return FOOTWEAR_SIZES;
  if (category === "sarbala") return SARBALA_SIZES;
  return STANDARD_SIZES;
}
