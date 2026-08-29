"use server";

import { requireUser, unauthorizedState } from "@/lib/supabase/require-user";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db/client";
import { storefrontProductImages, storefrontProducts } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import {
  STOREFRONT_BUCKET,
  slugify,
  type ActionState,
  type ImageInput,
} from "@/lib/website/admin-products-shared";
import {
  isShopCategorySlug,
  type ShopCategorySlug,
} from "@/lib/website/categories";

type ParsedProduct = {
  slug: string;
  name: string;
  category: ShopCategorySlug;
  priceRupees: number;
  salePriceRupees: number | null;
  readyToShip: boolean;
  colorName: string;
  colorHex: string;
  description: string | null;
  sizes: string[];
  tags: string[];
  featured: boolean;
  images: ImageInput[];
};

function parseImages(raw: FormDataEntryValue | null): ImageInput[] {
  if (typeof raw !== "string") return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is ImageInput =>
        i &&
        typeof i.storagePath === "string" &&
        typeof i.publicUrl === "string" &&
        typeof i.altText === "string",
    );
  } catch {
    return [];
  }
}

function parseStringList(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string" || !raw.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Re-checks everything the form sent. The client already validates, but a
 * Server Action is a public endpoint — it can't take the form's word for
 * it (same discipline as the internal catalog tool's parseForm).
 */
function parseForm(formData: FormData): ParsedProduct | string {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const priceRupees = Number(formData.get("priceRupees"));
  const salePriceRaw = String(formData.get("salePriceRupees") ?? "").trim();
  const salePriceRupees = salePriceRaw === "" ? null : Number(salePriceRaw);
  const readyToShip = formData.get("readyToShip") === "on";
  const colorName = String(formData.get("colorName") ?? "").trim();
  const colorHex = String(formData.get("colorHex") ?? "#171410").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sizes = parseStringList(formData.get("sizes"));
  const tags = parseStringList(formData.get("tags"));
  const featured = formData.get("featured") === "on";
  const images = parseImages(formData.get("images"));

  if (!name) return "Give the piece a name.";
  if (name.length > 160) return "That name is too long.";
  const slug = slugify(slugInput || name);
  if (!slug) return "Give the piece a URL slug.";
  if (!isShopCategorySlug(category)) return "Pick a category.";
  if (!Number.isFinite(priceRupees) || priceRupees < 0)
    return "Enter a valid price.";
  if (salePriceRupees !== null) {
    if (!Number.isFinite(salePriceRupees) || salePriceRupees < 0) {
      return "Enter a valid sale price, or leave it blank.";
    }
    if (salePriceRupees >= priceRupees) {
      return "Sale price must be lower than the regular price.";
    }
  }
  if (!colorName) return "Add a colour name.";
  if (!/^#[0-9a-fA-F]{6}$/.test(colorHex))
    return "Colour swatch must be a hex value like #171410.";
  if (images.length === 0) return "Add at least one photo.";

  return {
    slug,
    name,
    category,
    priceRupees: Math.round(priceRupees),
    salePriceRupees:
      salePriceRupees === null ? null : Math.round(salePriceRupees),
    readyToShip,
    colorName,
    colorHex,
    description: description || null,
    sizes,
    tags,
    featured,
    images,
  };
}

function revalidateFor(category: ShopCategorySlug, slug?: string) {
  revalidatePath("/admin/products");
  revalidatePath(`/shop/${category}`);
  if (slug) revalidatePath(`/product/${slug}`);
  revalidatePath("/"); // featured products / category tiles can be affected
}

/** Best-effort — a stale file is not worth failing the write over. */
async function removeStoredFiles(paths: string[]) {
  const realPaths = paths.filter((p) => !p.startsWith("http"));
  if (realPaths.length === 0) return;
  const supabase = await createClient();
  await supabase.storage.from(STOREFRONT_BUCKET).remove(realPaths);
}

function unconfiguredError(): ActionState {
  return {
    error:
      "The database isn't connected yet. Add DATABASE_URL to .env.local and run supabase/storefront-setup.sql in the Supabase SQL editor — see the note at the top of this page.",
  };
}

export async function createProduct(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await unauthorizedState();
  if (denied) return denied;
  const db = getDb();
  if (!db) return unconfiguredError();

  const parsed = parseForm(formData);
  if (typeof parsed === "string") return { error: parsed };

  try {
    // One transaction: a product row and its images commit together or
    // not at all. Previously a failed image insert left a published
    // product with no photos, which renders as a broken <Image src="">.
    await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(storefrontProducts)
        .values({
          slug: parsed.slug,
          name: parsed.name,
          category: parsed.category,
          priceRupees: parsed.priceRupees,
          salePriceRupees: parsed.salePriceRupees,
          readyToShip: parsed.readyToShip,
          colorName: parsed.colorName,
          colorHex: parsed.colorHex,
          description: parsed.description,
          sizes: parsed.sizes,
          tags: parsed.tags,
          featured: parsed.featured,
        })
        .returning();

      if (parsed.images.length > 0) {
        await tx.insert(storefrontProductImages).values(
          parsed.images.map((img, i) => ({
            productId: row.id,
            storagePath: img.storagePath,
            publicUrl: img.publicUrl,
            altText: img.altText || parsed.name,
            sortOrder: i,
          })),
        );
      }
    });
  } catch (err) {
    return { error: friendlyDbError(err, parsed.slug) };
  }

  revalidateFor(parsed.category, parsed.slug);
  redirect(`/admin/products/${parsed.slug}`);
}

export async function updateProduct(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await unauthorizedState();
  if (denied) return denied;
  const db = getDb();
  if (!db) return unconfiguredError();

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing product id." };

  const parsed = parseForm(formData);
  if (typeof parsed === "string") return { error: parsed };

  const removedPaths = parseStringList(formData.get("removedImagePaths"));

  let previousCategory: ShopCategorySlug | null = null;

  try {
    const existing = await db.query.storefrontProducts.findFirst({
      where: eq(storefrontProducts.id, id),
    });
    previousCategory = (existing?.category as ShopCategorySlug) ?? null;

    // The image swap is delete-then-insert, so without a transaction a
    // failed insert would leave the product with NO images — destroying
    // the existing gallery rather than merely failing the edit.
    await db.transaction(async (tx) => {
      await tx
        .update(storefrontProducts)
        .set({
          slug: parsed.slug,
          name: parsed.name,
          category: parsed.category,
          priceRupees: parsed.priceRupees,
          salePriceRupees: parsed.salePriceRupees,
          readyToShip: parsed.readyToShip,
          colorName: parsed.colorName,
          colorHex: parsed.colorHex,
          description: parsed.description,
          sizes: parsed.sizes,
          tags: parsed.tags,
          featured: parsed.featured,
          updatedAt: new Date(),
        })
        .where(eq(storefrontProducts.id, id));

      await tx
        .delete(storefrontProductImages)
        .where(eq(storefrontProductImages.productId, id));
      if (parsed.images.length > 0) {
        await tx.insert(storefrontProductImages).values(
          parsed.images.map((img, i) => ({
            productId: id,
            storagePath: img.storagePath,
            publicUrl: img.publicUrl,
            altText: img.altText || parsed.name,
            sortOrder: i,
          })),
        );
      }
    });
  } catch (err) {
    return { error: friendlyDbError(err, parsed.slug) };
  }

  await removeStoredFiles(removedPaths);

  revalidateFor(parsed.category, parsed.slug);
  if (previousCategory && previousCategory !== parsed.category) {
    revalidatePath(`/shop/${previousCategory}`);
  }
  redirect(`/admin/products/${parsed.slug}`);
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireUser();
  const db = getDb();
  if (!db) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const existing = await db.query.storefrontProducts.findFirst({
    where: eq(storefrontProducts.id, id),
    with: { images: true },
  });
  if (!existing) return;

  await db.delete(storefrontProducts).where(eq(storefrontProducts.id, id));
  // Image rows cascade automatically; their storage files still need
  // best-effort cleanup.
  await removeStoredFiles(existing.images.map((img) => img.storagePath));

  revalidateFor(existing.category as ShopCategorySlug, existing.slug);
  redirect("/admin/products");
}

function friendlyDbError(err: unknown, slug: string): string {
  const message = err instanceof Error ? err.message : String(err);
  if (
    message.includes("storefront_products_slug_idx") ||
    message.includes("duplicate key")
  ) {
    return `The slug "${slug}" is already used by another product — change the name or slug.`;
  }
  return message;
}
