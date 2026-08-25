import { SHOP_CATEGORIES } from "./categories";
import {
  BRAND_STORY_IMAGE,
  COLLECTIONS_STRIP_IMAGES,
  CUSTOM_KURTA_IMAGE,
  EDITORIAL_CAMPAIGN_IMAGE,
  HERO_IMAGE,
  INSTAGRAM_IMAGES,
  PRINCE_COAT_TEXTURE_IMAGE,
  REAL_WEDDINGS_IMAGES,
  SIGNATURE_SHERWANI_IMAGE,
  CATEGORY_IMAGES,
  type PlaceholderImage,
} from "./placeholder-images";

export type HomepageImageSlot = {
  key: string;
  /** Groups slots in the admin UI — matches the homepage's own section order. */
  section: string;
  label: string;
  /** Minimum source size, e.g. "2560 × 1600". Sized for the largest place
   *  this slot renders, at 2× for sharpness on retina screens. */
  recommended: string;
  /** Plain-language shape, e.g. "Landscape (wide)". */
  shape: string;
  /** Only where the crop is unusually demanding — kept short so the admin
   *  UI isn't a wall of caveats. */
  note?: string;
  fallback: PlaceholderImage;
};

const COLLECTION_LABELS: Record<string, string> = {
  wedding: "Wedding",
  groom: "Groom",
  eid: "Eid",
  formal: "Formal",
  "new-arrivals": "New Arrivals",
};

/**
 * Every photo on the homepage, in one list — the admin's single source of
 * truth for what's editable, and the public site's source of truth for
 * what falls back to a placeholder when nothing's been customised yet.
 * Order here is display order in /admin/homepage, not the page itself.
 *
 * `recommended` sizes are derived from how big each slot actually renders
 * (container width × 2 for retina), capped at the 2560px ceiling the
 * uploader compresses to — see FULL_BLEED_MAX_EDGE in lib/image.ts. Going
 * bigger than the recommendation is harmless; going smaller shows.
 */
export const HOMEPAGE_IMAGE_SLOTS: HomepageImageSlot[] = [
  {
    key: "hero",
    section: "Hero",
    label: "Hero image",
    recommended: "2560 × 1600",
    shape: "Landscape (wide)",
    note: "Cropped tall and narrow on phones — keep the subject centred with empty space left and right, or it gets cut off.",
    fallback: HERO_IMAGE,
  },

  ...SHOP_CATEGORIES.map((c) => ({
    key: `category_${c.slug}`,
    section: "Shop by Category",
    label: c.label,
    recommended: "1400 × 1750",
    shape: "Portrait (4:5)",
    note:
      c.slug === SHOP_CATEGORIES[0].slug
        ? "This one renders twice the size of the others — the large tile on the left."
        : undefined,
    fallback: CATEGORY_IMAGES[c.slug],
  })),

  {
    key: "editorial_campaign",
    section: "Editorial",
    label: "“For the Moments That Matter”",
    recommended: "2560 × 1100",
    shape: "Wide banner (21:9)",
    note: "Headline sits over the middle of this one — leave a calm, uncluttered centre.",
    fallback: EDITORIAL_CAMPAIGN_IMAGE,
  },
  {
    key: "signature_sherwani",
    section: "Editorial",
    label: "“The Sherwani, Reimagined”",
    recommended: "1500 × 2000",
    shape: "Portrait (3:4)",
    fallback: SIGNATURE_SHERWANI_IMAGE,
  },
  {
    key: "prince_coat_section",
    section: "Editorial",
    label: "“The Prince Coat”",
    recommended: "2560 × 1100",
    shape: "Wide banner (21:9)",
    note: "A tight fabric or tailoring detail reads better here than a full figure.",
    fallback: PRINCE_COAT_TEXTURE_IMAGE,
  },
  {
    key: "custom_kurta",
    section: "Editorial",
    label: "“Made Around You”",
    recommended: "1920 × 1440",
    shape: "Landscape (4:3)",
    fallback: CUSTOM_KURTA_IMAGE,
  },
  {
    key: "brand_story",
    section: "Editorial",
    label: "“Kudmayi Story”",
    recommended: "1500 × 1900",
    shape: "Portrait (4:5)",
    fallback: BRAND_STORY_IMAGE,
  },

  ...Object.keys(COLLECTIONS_STRIP_IMAGES).map((k) => ({
    key: `collection_${k}`,
    section: "Collections Strip",
    label: COLLECTION_LABELS[k] ?? k,
    recommended: "800 × 1070",
    shape: "Portrait (3:4)",
    fallback: COLLECTIONS_STRIP_IMAGES[k as keyof typeof COLLECTIONS_STRIP_IMAGES],
  })),

  ...REAL_WEDDINGS_IMAGES.map((img, i) => ({
    key: `real_wedding_${i + 1}`,
    section: "Real Weddings",
    label: `Photo ${i + 1}`,
    recommended: "1200 × 1200",
    shape: i === 0 ? "Square-ish (large tile)" : "Square-ish",
    note: i === 0 ? "The big frame — this one carries the section." : undefined,
    fallback: img,
  })),

  ...INSTAGRAM_IMAGES.map((img, i) => ({
    key: `instagram_${i + 1}`,
    section: "Instagram Grid",
    label: `Tile ${i + 1}`,
    recommended: "800 × 800",
    shape: "Square (1:1)",
    fallback: img,
  })),
];

export const HOMEPAGE_IMAGE_SLOT_KEYS = new Set(HOMEPAGE_IMAGE_SLOTS.map((s) => s.key));
