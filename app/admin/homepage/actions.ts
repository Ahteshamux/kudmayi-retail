"use server";

import { unauthorizedState } from "@/lib/supabase/require-user";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db/client";
import { homepageImages, homepageText } from "@/lib/db/schema";
import { HOMEPAGE_IMAGE_SLOT_KEYS } from "@/lib/website/homepage-slots";
import { HOMEPAGE_TEXT_SLOT_KEYS } from "@/lib/website/homepage-text";

const COLUMN_FOR = {
  desktop: "imageUrl",
  tablet: "imageUrlTablet",
  mobile: "imageUrlMobile",
} as const;

type Breakpoint = keyof typeof COLUMN_FOR;

function isBreakpoint(value: string): value is Breakpoint {
  return value in COLUMN_FOR;
}

/**
 * Called directly from the client component (not via a <form action>) —
 * the uploader already has the finished Storage URL in hand once the
 * upload completes, so this just persists it. Next.js allows invoking a
 * Server Action as a plain async function from a Client Component, same
 * as calling it via a form.
 *
 * `imageUrl` of null clears that breakpoint's override, which makes the
 * slot fall back to the desktop crop again. Desktop itself can't be
 * cleared — it's what everything else falls back to.
 */
export async function saveHomepageImage(
  slotKey: string,
  breakpoint: string,
  imageUrl: string | null,
  altText: string,
): Promise<{ error: string | null }> {
  const denied = await unauthorizedState();
  if (denied) return denied;

  if (!HOMEPAGE_IMAGE_SLOT_KEYS.has(slotKey)) {
    return { error: "Unknown homepage slot." };
  }
  if (!isBreakpoint(breakpoint)) {
    return { error: "Unknown screen size." };
  }
  if (breakpoint === "desktop" && !imageUrl) {
    return { error: "The desktop image can't be removed — everything falls back to it." };
  }

  const db = getDb();
  if (!db) {
    return {
      error:
        "The database isn't connected yet. Add DATABASE_URL to .env.local and run supabase/storefront-setup.sql — see the note at the top of this page.",
    };
  }

  const column = COLUMN_FOR[breakpoint];

  try {
    const existing = await db.query.homepageImages.findFirst({
      where: eq(homepageImages.slotKey, slotKey),
    });

    if (existing) {
      await db
        .update(homepageImages)
        .set({ [column]: imageUrl, altText, updatedAt: new Date() })
        .where(eq(homepageImages.slotKey, slotKey));
    } else {
      if (!imageUrl) return { error: null }; // nothing stored yet, nothing to clear
      // A tablet/mobile crop can be uploaded before the desktop one has
      // been replaced; the row still needs a desktop value, so seed it
      // with the same file until desktop is set explicitly.
      await db.insert(homepageImages).values({
        slotKey,
        imageUrl,
        altText,
        ...(breakpoint === "desktop" ? {} : { [column]: imageUrl }),
      });
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }

  revalidatePath("/");
  revalidatePath("/admin/homepage");
  return { error: null };
}

/**
 * Saves an admin-edited homepage heading. Same shape as saveHomepageImage
 * above — an empty value isn't accepted, since an empty heading is a
 * broken page, not a valid override; clearing back to the built-in copy
 * would need its own affordance if that's ever wanted.
 */
export async function saveHomepageText(
  slotKey: string,
  value: string,
): Promise<{ error: string | null }> {
  const denied = await unauthorizedState();
  if (denied) return denied;

  if (!HOMEPAGE_TEXT_SLOT_KEYS.has(slotKey)) {
    return { error: "Unknown homepage text slot." };
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return { error: "The heading can't be empty." };
  }

  const db = getDb();
  if (!db) {
    return {
      error:
        "The database isn't connected yet. Add DATABASE_URL to .env.local and run supabase/storefront-setup.sql — see the note at the top of this page.",
    };
  }

  try {
    const existing = await db.query.homepageText.findFirst({
      where: eq(homepageText.slotKey, slotKey),
    });

    if (existing) {
      await db
        .update(homepageText)
        .set({ value: trimmed, updatedAt: new Date() })
        .where(eq(homepageText.slotKey, slotKey));
    } else {
      await db.insert(homepageText).values({ slotKey, value: trimmed });
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }

  revalidatePath("/");
  revalidatePath("/admin/homepage");
  return { error: null };
}
