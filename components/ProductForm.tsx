"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { ImageUpload } from "./ImageUpload";
import { CATEGORIES, type CategorySlug } from "@/lib/categories";
import type { ActionState } from "@/app/admin/catalog/product/actions";
import type { Product } from "@/lib/types";

type Props = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  product?: Product;
  /** Preselects the category when adding from inside a collection. */
  defaultCategory?: CategorySlug;
  cancelHref: string;
  submitLabel: string;
};

function SubmitButton({
  label,
  uploading,
}: {
  label: string;
  uploading: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || uploading}
      className="u-btn u-caps"
    >
      {pending ? "Saving…" : uploading ? "Waiting for photo…" : label}
    </button>
  );
}

export function ProductForm({
  action,
  product,
  defaultCategory,
  cancelHref,
  submitLabel,
}: Props) {
  const [state, formAction] = useActionState<ActionState, FormData>(action, {
    error: null,
  });
  const [imageUrl, setImageUrl] = useState<string | null>(
    product?.image_url ?? null,
  );
  const [uploading, setUploading] = useState(false);

  return (
    <form action={formAction} className="max-w-lg space-y-7">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="image_url" value={imageUrl ?? ""} />

      <ImageUpload
        value={imageUrl}
        onChange={setImageUrl}
        onUploadingChange={setUploading}
      />

      <div className="space-y-2">
        <label htmlFor="name" className="u-caps text-muted block">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={120}
          defaultValue={product?.name}
          placeholder="Ivory Raw Silk Sherwani"
          className="u-field"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="color" className="u-caps text-muted block">
          Colour
        </label>
        <input
          id="color"
          name="color"
          required
          maxLength={60}
          defaultValue={product?.color}
          placeholder="Ivory"
          className="u-field"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="u-caps text-muted block">
          Category
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue={product?.category ?? defaultCategory ?? ""}
          className="u-field"
        >
          <option value="" disabled>
            Choose one
          </option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <label className="border-line bg-surface flex cursor-pointer items-center justify-between gap-4 border p-4">
        <span>
          <span className="u-caps text-espresso block">Available</span>
          <span className="text-muted mt-1.5 block text-sm">
            Turn off for pieces that are out on rent or being altered.
          </span>
        </span>
        <input
          type="checkbox"
          name="available"
          defaultChecked={product?.available ?? true}
          className="accent-brass h-5 w-5 shrink-0"
        />
      </label>

      {state.error && (
        <p role="alert" className="text-rust text-sm">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <SubmitButton label={submitLabel} uploading={uploading} />
        <Link href={cancelHref} className="u-btn-ghost u-caps">
          Cancel
        </Link>
      </div>
    </form>
  );
}
