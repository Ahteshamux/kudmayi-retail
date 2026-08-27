import { getDb } from "@/lib/db/client";
import { homepageImages } from "@/lib/db/schema";
import { HOMEPAGE_IMAGE_SLOTS } from "./homepage-slots";
import type { PlaceholderImage } from "./placeholder-images";

/**
 * A homepage photo, with optional art-direction crops. `src` is the
 * desktop image and the only one guaranteed present; `tablet` and
 * `mobile` are set only where someone uploaded a separate crop.
 */
export type HomepageImage = PlaceholderImage & {
  tablet?: string;
  mobile?: string;
};

export type HomepageImages = Record<string, HomepageImage>;

/**
 * Every homepage photo, keyed by slot — DB value where one exists, the
 * slot's built-in fallback otherwise. One query for the whole page rather
 * than one per section, and the same safe-fallback philosophy as
 * lib/website/products.ts: no database, an unreachable database, or a
 * database with no rows for a slot all just mean "show the fallback",
 * never a broken homepage.
 */
export async function getAllHomepageImages(): Promise<HomepageImages> {
  const images: HomepageImages = {};
  for (const slot of HOMEPAGE_IMAGE_SLOTS) images[slot.key] = slot.fallback;

  const db = getDb();
  if (!db) return images;

  try {
    const rows = await db.select().from(homepageImages);
    for (const row of rows) {
      if (row.slotKey in images) {
        images[row.slotKey] = {
          src: row.imageUrl,
          alt: row.altText || images[row.slotKey].alt,
          tablet: row.imageUrlTablet ?? undefined,
          mobile: row.imageUrlMobile ?? undefined,
        };
      }
    }
  } catch (err) {
    console.error(
      "[homepage-content] database query failed, serving fallback photography instead:",
      err,
    );
  }

  return images;
}
