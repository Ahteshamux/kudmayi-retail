import {
  ACCESSORIES_HREF,
  ACCESSORY_CATEGORIES,
  CLOTHING_CATEGORIES,
  SARBALA_CATEGORY,
} from "./categories";

export type NavColumn = { heading: string; links: { label: string; href: string }[] };
export type NavEntry = { label: string; href: string; columns: NavColumn[] | null };

/**
 * Shared navigation structure for the desktop mega-menu (PrimaryNav) and
 * the mobile drawer (MobileNav), so the two can't drift apart.
 *
 * Every in-page anchor is written as `/#section`, not `#section` — a bare
 * hash only resolves against the current page, so those links did nothing
 * at all from /shop/[category], /product/[slug], /search, or /wishlist.
 * The leading slash routes to the homepage first, then scrolls.
 */
const ACCESSORIES_COLUMN: NavColumn = {
  heading: "Accessories",
  links: [
    { label: "All Accessories", href: ACCESSORIES_HREF },
    ...ACCESSORY_CATEGORIES.map((c) => ({ label: c.label, href: `/shop/${c.slug}` })),
  ],
};

export const PRIMARY_NAV: NavEntry[] = [
  {
    label: "Shop",
    href: "/#shop-by-category",
    columns: [
      {
        heading: "Shop the Edit",
        links: [
          { label: "The Groom Edit", href: "/#groom-edit" },
          { label: "New Arrivals", href: "/#shop-by-category" },
        ],
      },
      {
        heading: "Clothing",
        links: [...CLOTHING_CATEGORIES, SARBALA_CATEGORY].map((c) => ({
          label: c.label,
          href: `/shop/${c.slug}`,
        })),
      },
      ACCESSORIES_COLUMN,
    ],
  },
  { label: SARBALA_CATEGORY.label, href: `/shop/${SARBALA_CATEGORY.slug}`, columns: null },
  {
    label: "Accessories",
    href: ACCESSORIES_HREF,
    columns: [ACCESSORIES_COLUMN],
  },
  {
    label: "Collections",
    href: "/#collections",
    columns: [
      {
        heading: "Collections",
        links: [
          { label: "Wedding", href: "/#collections" },
          { label: "Groom", href: "/#collections" },
          { label: "Eid", href: "/#collections" },
          { label: "Formal", href: "/#collections" },
          { label: "New Arrivals", href: "/#collections" },
        ],
      },
    ],
  },
  {
    label: "Custom",
    href: "/custom-kurta",
    columns: [
      {
        heading: "Custom",
        links: [
          { label: "Custom Kurtas", href: "/custom-kurta" },
          { label: "Bespoke", href: "/#bespoke" },
        ],
      },
    ],
  },
  { label: "About", href: "/#story", columns: null },
];

/** Everything in the mobile drawer below the big category list. */
export const SECONDARY_MOBILE_LINKS: { label: string; href: string }[] = [
  { label: "Collections", href: "/#collections" },
  { label: "The Groom Edit", href: "/#groom-edit" },
  { label: "Custom Kurtas", href: "/custom-kurta" },
  { label: "Bespoke", href: "/#bespoke" },
  { label: "Our Story", href: "/#story" },
];
