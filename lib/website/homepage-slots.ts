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
 */
export const HOMEPAGE_IMAGE_SLOTS: HomepageImageSlot[] = [
  { key: "hero", section: "Hero", label: "Hero image", fallback: HERO_IMAGE },

  ...SHOP_CATEGORIES.map((c) => ({
    key: `category_${c.slug}`,
    section: "Shop by Category",
    label: c.label,
    fallback: CATEGORY_IMAGES[c.slug],
  })),

  {
    key: "editorial_campaign",
    section: "Editorial",
    label: "“For the Moments That Matter”",
    fallback: EDITORIAL_CAMPAIGN_IMAGE,
  },
  {
    key: "signature_sherwani",
    section: "Editorial",
    label: "“The Sherwani, Reimagined”",
    fallback: SIGNATURE_SHERWANI_IMAGE,
  },
  {
    key: "prince_coat_section",
    section: "Editorial",
    label: "“The Prince Coat”",
    fallback: PRINCE_COAT_TEXTURE_IMAGE,
  },
  {
    key: "custom_kurta",
    section: "Editorial",
    label: "“Made Around You”",
    fallback: CUSTOM_KURTA_IMAGE,
  },
  {
    key: "brand_story",
    section: "Editorial",
    label: "“Kudmayi Story”",
    fallback: BRAND_STORY_IMAGE,
  },

  ...Object.keys(COLLECTIONS_STRIP_IMAGES).map((k) => ({
    key: `collection_${k}`,
    section: "Collections Strip",
    label: COLLECTION_LABELS[k] ?? k,
    fallback: COLLECTIONS_STRIP_IMAGES[k as keyof typeof COLLECTIONS_STRIP_IMAGES],
  })),

  ...REAL_WEDDINGS_IMAGES.map((img, i) => ({
    key: `real_wedding_${i + 1}`,
    section: "Real Weddings",
    label: `Photo ${i + 1}`,
    fallback: img,
  })),

  ...INSTAGRAM_IMAGES.map((img, i) => ({
    key: `instagram_${i + 1}`,
    section: "Instagram Grid",
    label: `Tile ${i + 1}`,
    fallback: img,
  })),
];

export const HOMEPAGE_IMAGE_SLOT_KEYS = new Set(HOMEPAGE_IMAGE_SLOTS.map((s) => s.key));
