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

/** Which screen a crop is for. "desktop" is also the fallback for the others. */
export type Breakpoint = "mobile" | "tablet" | "desktop";

export type TierSpec = {
  breakpoint: Breakpoint;
  label: string;
  /** Minimum source size, e.g. "2560 × 1700", sized for the largest this
   *  tier renders at 2× for retina sharpness. */
  recommended: string;
  /** Plain-language shape, e.g. "Landscape (wide)". */
  shape: string;
};

export type HomepageImageSlot = {
  key: string;
  /** Groups slots in the admin UI — matches the homepage's own section order. */
  section: string;
  label: string;
  /**
   * One entry per separately-uploadable crop, always ending with desktop.
   * Most slots render the same aspect ratio at every width, so they carry
   * a single tier and the admin shows one upload box. Only the sections
   * whose shape genuinely changes get two or three — adding boxes to the
   * rest would triple the upload work for identical output.
   */
  tiers: TierSpec[];
  /** Only where the crop is unusually demanding — kept short so the admin
   *  UI isn't a wall of caveats. */
  note?: string;
  fallback: PlaceholderImage;
};

/** The common case: one shape at every screen width. */
function single(recommended: string, shape: string): TierSpec[] {
  return [{ breakpoint: "desktop", label: "All screens", recommended, shape }];
}

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
    tiers: [
      { breakpoint: "mobile", label: "Mobile", recommended: "1200 × 1950", shape: "Tall portrait" },
      { breakpoint: "tablet", label: "Tablet", recommended: "1600 × 1300", shape: "Slightly wide" },
      { breakpoint: "desktop", label: "Desktop", recommended: "2560 × 1700", shape: "Landscape (wide)" },
    ],
    note: "The shape changes the most here. Upload only Desktop and it's cropped tall and narrow on phones — supply Mobile too if the subject gets cut off.",
    fallback: HERO_IMAGE,
  },

  ...SHOP_CATEGORIES.map((c): HomepageImageSlot => ({
    key: `category_${c.slug}`,
    section: "Shop by Category",
    label: c.label,
    tiers: [
      { breakpoint: "mobile" as const, label: "Mobile", recommended: "1200 × 1500", shape: "Portrait (4:5)" },
      { breakpoint: "desktop" as const, label: "Desktop", recommended: "1440 × 1280", shape: "Slightly wide (9:8)" },
    ],
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
    tiers: single("2560 × 1100", "Wide banner (21:9)"),
    note: "Headline sits over the middle of this one — leave a calm, uncluttered centre.",
    fallback: EDITORIAL_CAMPAIGN_IMAGE,
  },
  {
    key: "signature_sherwani",
    section: "Editorial",
    label: "“The Sherwani, Reimagined”",
    tiers: single("1500 × 2000", "Portrait (3:4)"),
    fallback: SIGNATURE_SHERWANI_IMAGE,
  },
  {
    key: "prince_coat_section",
    section: "Editorial",
    label: "“The Prince Coat”",
    tiers: single("2560 × 1100", "Wide banner (21:9)"),
    note: "A tight fabric or tailoring detail reads better here than a full figure.",
    fallback: PRINCE_COAT_TEXTURE_IMAGE,
  },
  {
    key: "custom_kurta",
    section: "Editorial",
    label: "“Made Around You”",
    tiers: [
      { breakpoint: "mobile", label: "Mobile", recommended: "1200 × 900", shape: "Landscape (4:3)" },
      { breakpoint: "desktop", label: "Desktop", recommended: "1920 × 1200", shape: "Wide (16:10)" },
    ],
    fallback: CUSTOM_KURTA_IMAGE,
  },
  {
    key: "brand_story",
    section: "Editorial",
    label: "“Kudmayi Story”",
    tiers: single("1500 × 1900", "Portrait (4:5)"),
    fallback: BRAND_STORY_IMAGE,
  },

  ...Object.keys(COLLECTIONS_STRIP_IMAGES).map((k): HomepageImageSlot => ({
    key: `collection_${k}`,
    section: "Collections Strip",
    label: COLLECTION_LABELS[k] ?? k,
    tiers: single("800 × 1070", "Portrait (3:4)"),
    fallback: COLLECTIONS_STRIP_IMAGES[k as keyof typeof COLLECTIONS_STRIP_IMAGES],
  })),

  ...REAL_WEDDINGS_IMAGES.map((img, i): HomepageImageSlot => ({
    key: `real_wedding_${i + 1}`,
    section: "Real Weddings",
    label: `Photo ${i + 1}`,
    tiers: [
      { breakpoint: "mobile" as const, label: "Mobile", recommended: "1200 × 1500", shape: "Portrait (4:5)" },
      { breakpoint: "desktop" as const, label: "Desktop", recommended: "1920 × 1120", shape: "Wide (12:7)" },
    ],
    note: i === 0 ? "The big frame — this one carries the section." : undefined,
    fallback: img,
  })),

  ...INSTAGRAM_IMAGES.map((img, i): HomepageImageSlot => ({
    key: `instagram_${i + 1}`,
    section: "Instagram Grid",
    label: `Tile ${i + 1}`,
    tiers: single("800 × 800", "Square (1:1)"),
    fallback: img,
  })),
];

export const HOMEPAGE_IMAGE_SLOT_KEYS = new Set(HOMEPAGE_IMAGE_SLOTS.map((s) => s.key));
