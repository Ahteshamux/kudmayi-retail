/**
 * Split out of app/admin/products/actions.ts because a "use server" file
 * can only export async Server Actions — a plain constant or a sync
 * helper function in that file gets silently stripped at build time
 * (Next.js errors with a confusing "module has no exports" instead).
 */

export const STOREFRONT_BUCKET = "storefront-products";

export type ImageInput = { storagePath: string; publicUrl: string; altText: string };

export type ActionState = { error: string | null };

/** "sherwanis" is already a slug; this only has to handle admin-entered names. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
