import { getDb } from "@/lib/db/client";
import { homepageImages, homepageText } from "@/lib/db/schema";
import { HOMEPAGE_IMAGE_SLOTS } from "./homepage-slots";
import { HOMEPAGE_TEXT_SLOTS } from "./homepage-text";
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
 * than one per section.
 *
 * Unlike lib/website/products.ts, the fallback is NOT suppressed in
 * production. A fabricated product is actively harmful — a customer can
 * cart it and send a WhatsApp order for a piece that does not exist —
 * whereas a fallback photo is cosmetic, and a homepage with holes in it is
 * worse than one carrying stock art.
 *
 * But every built-in fallback is a hotlinked Unsplash photo that is not
 * Kudmayi's own (see placeholder-images.ts), so shipping one is a
 * licensing and brand problem even though it is not a correctness one. In
 * production any slot still on its fallback is therefore logged by name,
 * so it is discoverable rather than silent.
 */
export async function getAllHomepageImages(): Promise<HomepageImages> {
  const images: HomepageImages = {};
  for (const slot of HOMEPAGE_IMAGE_SLOTS) images[slot.key] = slot.fallback;

  const filled = new Set<string>();

  const db = getDb();
  if (!db) {
    warnAboutFallbacks(filled, "no DATABASE_URL is configured");
    return images;
  }

  try {
    const rows = await db.select().from(homepageImages);
    for (const row of rows) {
      if (row.slotKey in images) {
        filled.add(row.slotKey);
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
      "[homepage-content] database query failed; the homepage is now serving " +
        "placeholder Unsplash photography for EVERY slot:",
      err,
    );
    return images;
  }

  warnAboutFallbacks(filled, "no image has been uploaded for them");
  return images;
}

export type HomepageTextValues = Record<string, string>;

/**
 * Every homepage heading, keyed by slot — DB value where an admin has set
 * one, the slot's own copy otherwise. Same shape as getAllHomepageImages
 * above, including the "just return the fallbacks" behaviour when the
 * database isn't configured or the query fails — a stale/default heading
 * is cosmetic, not a reason to break the page.
 */
export async function getAllHomepageText(): Promise<HomepageTextValues> {
  const text: HomepageTextValues = {};
  for (const slot of HOMEPAGE_TEXT_SLOTS) text[slot.key] = slot.fallback;

  const db = getDb();
  if (!db) return text;

  try {
    const rows = await db.select().from(homepageText);
    for (const row of rows) {
      if (row.slotKey in text) text[row.slotKey] = row.value;
    }
  } catch (err) {
    console.error(
      "[homepage-content] homepage_text query failed; falling back to default headings:",
      err,
    );
  }

  return text;
}

/**
 * Names the slots still showing stock photography. Production only —
 * in development the fallbacks are the expected state and the noise would
 * be constant.
 */
function warnAboutFallbacks(filled: Set<string>, reason: string) {
  if (process.env.NODE_ENV !== "production") return;

  const missing = HOMEPAGE_IMAGE_SLOTS.map((s) => s.key).filter(
    (key) => !filled.has(key),
  );
  if (missing.length === 0) return;

  console.warn(
    `[homepage-content] ${missing.length} homepage slot(s) are serving ` +
      `placeholder Unsplash photography because ${reason}. These are not ` +
      `Kudmayi's own images and should be replaced in /admin/homepage ` +
      `before launch: ${missing.join(", ")}`,
  );
}
