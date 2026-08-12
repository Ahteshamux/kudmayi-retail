"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isCategorySlug, type CategorySlug } from "@/lib/categories";
import { storagePathFromPublicUrl } from "@/lib/image";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "product-images";

export type ActionState = { error: string | null };

type ProductInput = {
  name: string;
  category: CategorySlug;
  color: string;
  imageUrl: string | null;
  available: boolean;
};

/**
 * Re-checks everything the form sent. The client already validates, but a
 * Server Action is a public endpoint — it can't take the form's word for it.
 */
function parseForm(formData: FormData): ProductInput | string {
  const name = String(formData.get("name") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const imageUrl = String(formData.get("image_url") ?? "").trim() || null;
  const available = formData.get("available") === "on";

  if (!name) return "Give the piece a name.";
  if (name.length > 120) return "That name is too long.";
  if (!color) return "Add a colour.";
  if (color.length > 60) return "That colour name is too long.";
  if (!isCategorySlug(category)) return "Pick a category.";

  return { name, category, color, imageUrl, available };
}

/** Best-effort cleanup — a stale file is not worth failing the write over. */
async function removeStoredImage(
  supabase: SupabaseClient,
  imageUrl: string | null,
) {
  const path = storagePathFromPublicUrl(imageUrl, BUCKET);
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}

function revalidateFor(category: CategorySlug, id?: string) {
  revalidatePath("/");
  revalidatePath(`/category/${category}`);
  if (id) revalidatePath(`/product/${id}`);
}

export async function createProduct(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseForm(formData);
  if (typeof parsed === "string") return { error: parsed };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: parsed.name,
      category: parsed.category,
      color: parsed.color,
      image_url: parsed.imageUrl,
      available: parsed.available,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidateFor(parsed.category);
  redirect(`/product/${data.id}`);
}

export async function updateProduct(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing product id." };

  const parsed = parseForm(formData);
  if (typeof parsed === "string") return { error: parsed };

  const supabase = await createClient();

  // Read the old photo first so a replaced one can be cleaned up after.
  const { data: existing } = await supabase
    .from("products")
    .select("image_url, category")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("products")
    .update({
      name: parsed.name,
      category: parsed.category,
      color: parsed.color,
      image_url: parsed.imageUrl,
      available: parsed.available,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  if (existing?.image_url && existing.image_url !== parsed.imageUrl) {
    await removeStoredImage(supabase, existing.image_url);
  }

  revalidateFor(parsed.category, id);
  // Moving categories leaves the old grid stale otherwise.
  if (existing && existing.category !== parsed.category) {
    revalidatePath(`/category/${existing.category}`);
  }

  redirect(`/product/${id}`);
}

export async function deleteProduct(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("products")
    .select("image_url, category")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await removeStoredImage(supabase, existing?.image_url ?? null);

  revalidatePath("/");
  if (existing && isCategorySlug(existing.category)) {
    revalidatePath(`/category/${existing.category}`);
  }

  redirect(existing?.category ? `/category/${existing.category}` : "/");
}
