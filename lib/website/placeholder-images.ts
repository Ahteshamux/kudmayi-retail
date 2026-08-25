/**
 * Placeholder photography for the public site.
 *
 * TODO(pre-launch): every entry here is a hotlinked Unsplash photo, picked
 * to match the mood/subject of its section. None of it is Kudmayi's own —
 * swap each `src` for owned/licensed photography before this goes live.
 * Alt text is co-located with each image and describes the actual scene, so
 * it stays accurate even before the swap.
 */

const UNSPLASH = "https://images.unsplash.com";

/** Requests a specific crop width/quality from Unsplash's own CDN — next/image optimizes further on top of this. */
function unsplash(photoId: string, width: number): string {
  return `${UNSPLASH}/photo-${photoId}?auto=format&fit=crop&w=${width}&q=80`;
}

export type PlaceholderImage = { src: string; alt: string };

export const HERO_IMAGE: PlaceholderImage = {
  src: unsplash("1760080838961-4208536db385", 2400),
  alt: "Groom in a white embroidered sherwani with a red turban and scarf",
};

export const CATEGORY_IMAGES: Record<
  "sherwanis" | "prince-coats" | "waistcoats" | "kurtas" | "suits",
  PlaceholderImage
> = {
  sherwanis: {
    src: unsplash("1759906766080-82b785c61f51", 1600),
    alt: "Groom in traditional Indian wedding sherwani",
  },
  "prince-coats": {
    src: unsplash("1755889767241-5ec60ce9506f", 1600),
    alt: "Man in a tailored bandhgala jacket posing against a floral backdrop",
  },
  waistcoats: {
    src: unsplash("1782789086573-77dac305065e", 1600),
    alt: "Stylish man buttoning a black waistcoat indoors",
  },
  kurtas: {
    src: unsplash("1755931446696-a56fcfac1244", 1600),
    alt: "Man in a white kurta standing against a stone wall",
  },
  suits: {
    src: unsplash("1609840170480-4c440bcd5d8f", 1600),
    alt: "Man in a grey suit jacket standing on a white staircase",
  },
};

export const EDITORIAL_CAMPAIGN_IMAGE: PlaceholderImage = {
  src: unsplash("1587271636175-90d58cdad458", 2400),
  alt: "Wedding ceremony taking place under a floral canopy",
};

export const SIGNATURE_SHERWANI_IMAGE: PlaceholderImage = {
  src: unsplash("1781106784087-d6f4432ad721", 1600),
  alt: "Man in traditional sherwani attire standing on a rooftop",
};

export const PRINCE_COAT_TEXTURE_IMAGE: PlaceholderImage = {
  src: unsplash("1630512873976-8a9113639cf2", 2000),
  alt: "Close-up of black textured fabric in grayscale",
};

export const CUSTOM_KURTA_IMAGE: PlaceholderImage = {
  src: unsplash("1618866903271-595806e0679d", 1600),
  alt: "Tailored jacket laid across a sewing machine",
};

export const BRAND_STORY_IMAGE: PlaceholderImage = {
  src: unsplash("1673201229733-69d19c5c4a87", 1600),
  alt: "A tailor at work on a sewing machine in an atelier",
};

export const COLLECTIONS_STRIP_IMAGES: Record<
  "wedding" | "groom" | "eid" | "formal" | "new-arrivals",
  PlaceholderImage
> = {
  wedding: {
    src: unsplash("1754782915842-aa4fca6c203a", 1200),
    alt: "Couple showered with flower petals during a traditional wedding ceremony",
  },
  groom: {
    src: unsplash("1744804298331-14dd49f7659e", 1200),
    alt: "Groom smiling on a balcony",
  },
  eid: {
    src: unsplash("1626967823200-fc462e636ec1", 1200),
    alt: "Man in a black kurta for Eid",
  },
  formal: {
    src: unsplash("1594552076826-aac9ddc041d3", 1200),
    alt: "Man in a grey suit jacket and glasses",
  },
  "new-arrivals": {
    src: unsplash("1619603364937-8d7af41ef206", 1200),
    alt: "Man in a brown tailored coat",
  },
};

export const REAL_WEDDINGS_IMAGES: (PlaceholderImage & {
  caption?: string;
})[] = [
  {
    src: unsplash("1679937698873-6065742c8d32", 1600),
    alt: "Bride and groom getting ready for their wedding ceremony",
    caption: "Ahmed & Sana — Lahore, 2025",
  },
  {
    src: unsplash("1741201864879-c5e7f81c98b0", 1200),
    alt: "Bride and groom celebrating a wedding ceremony",
  },
  {
    src: unsplash("1754782915524-714d8534a5df", 1200),
    alt: "Groom sharing a moment with the bride during the ceremony",
    caption: "Bilal & Areeba — Karachi, 2025",
  },
  {
    src: unsplash("1725658784875-9973c1b7adbe", 1200),
    alt: "Wedding party standing together on a red carpet",
  },
  {
    src: unsplash("1635919254131-cbaa334ef53e", 1200),
    alt: "Guests gathered together at a wedding celebration",
  },
];

export const INSTAGRAM_IMAGES: PlaceholderImage[] = [
  {
    src: unsplash("1783188223691-8a233ee51cd8", 800),
    alt: "White embroidered sherwani detail",
  },
  {
    src: unsplash("1755931446696-a56fcfac1244", 800),
    alt: "Man in a white kurta",
  },
  {
    src: unsplash("1609840170480-4c440bcd5d8f", 800),
    alt: "Man in a grey suit on a staircase",
  },
  {
    src: unsplash("1782789086573-77dac305065e", 800),
    alt: "Man buttoning a black waistcoat",
  },
  {
    src: unsplash("1744804298331-14dd49f7659e", 800),
    alt: "Groom smiling on a balcony",
  },
  {
    src: unsplash("1619603364937-8d7af41ef206", 800),
    alt: "Man in a brown tailored coat",
  },
];
