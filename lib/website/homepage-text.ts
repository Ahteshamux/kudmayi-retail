export type HomepageTextSlot = {
  key: string;
  /** Groups slots in the admin UI — matches HOMEPAGE_IMAGE_SLOTS's grouping. */
  section: string;
  label: string;
  fallback: string;
};

/**
 * Every homepage heading an admin can override, in one list — same
 * "slot with a fallback" convention as HOMEPAGE_IMAGE_SLOTS in
 * homepage-slots.ts. Starts with just the one heading that was asked for;
 * add more entries here (and to the matching component) as other sections
 * need the same treatment.
 */
export const HOMEPAGE_TEXT_SLOTS: HomepageTextSlot[] = [
  {
    key: "editorial_campaign_heading",
    section: "Editorial",
    label: "“For the Moments That Matter” — heading",
    fallback: "For the Moments That Matter.",
  },
];

export const HOMEPAGE_TEXT_SLOT_KEYS = new Set(HOMEPAGE_TEXT_SLOTS.map((s) => s.key));
