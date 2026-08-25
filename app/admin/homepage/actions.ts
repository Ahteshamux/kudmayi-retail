"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db/client";
import { homepageImages } from "@/lib/db/schema";
import { HOMEPAGE_IMAGE_SLOT_KEYS } from "@/lib/website/homepage-slots";

/**
 * Called directly from the client component (not via a <form action>) —
 * the uploader already has the finished Storage URL in hand once the
 * upload completes, so this just persists it. Next.js allows invoking a
 * Server Action as a plain async function from a Client Component, same
 * as calling it via a form.
 */
export async function saveHomepageImage(
  slotKey: string,
  imageUrl: string,
  altText: string,
): Promise<{ error: string | null }> {
  if (!HOMEPAGE_IMAGE_SLOT_KEYS.has(slotKey)) {
    return { error: "Unknown homepage slot." };
  }
  if (!imageUrl) {
    return { error: "Missing image." };
  }

  const db = getDb();
  if (!db) {
    return {
      error:
        "The database isn't connected yet. Add DATABASE_URL to .env.local and run supabase/storefront-setup.sql — see the note at the top of this page.",
    };
  }

  try {
    await db
      .insert(homepageImages)
      .values({ slotKey, imageUrl, altText })
      .onConflictDoUpdate({
        target: homepageImages.slotKey,
        set: { imageUrl, altText, updatedAt: new Date() },
      });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }

  revalidatePath("/");
  revalidatePath("/admin/homepage");
  return { error: null };
}
