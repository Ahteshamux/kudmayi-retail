"use client";

import Link from "next/link";
import { startTransition, useActionState, useCallback, useState } from "react";
import { ColorFromPhoto } from "./ColorFromPhoto";
import { ProductImagesUploader } from "./ProductImagesUploader";
import { slugify, type ActionState, type ImageInput } from "@/lib/website/admin-products-shared";
import { SITE_HOST } from "@/lib/website/constants";
import { SHOP_CATEGORIES } from "@/lib/website/categories";
import type { Product } from "@/lib/website/products";

function SubmitButton({
  label,
  pending,
  uploading,
}: {
  label: string;
  pending: boolean;
  uploading: boolean;
}) {
  return (
    <button type="submit" disabled={pending || uploading} className="u-btn u-caps">
      {pending ? "Saving…" : uploading ? "Waiting for photos…" : label}
    </button>
  );
}

type Prefill = {
  name?: string;
  category?: string;
  colorName?: string;
  images?: ImageInput[];
};

export function ProductForm({
  action,
  product,
  prefill,
  defaultCategory,
  retailProductId,
  submitLabel,
  cancelHref,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  product?: Product & { id: string; featured: boolean; images: ImageInput[] };
  /** Starting values for a brand-new product — e.g. from "Publish to
   *  Storefront" on a Retail catalog item. Ignored once `product` (edit
   *  mode) is set. */
  prefill?: Prefill;
  defaultCategory?: string;
  /** The Retail item a new listing is published from — stored so a second
   *  publish of the same item opens this listing instead. */
  retailProductId?: string;
  submitLabel: string;
  cancelHref: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {
    error: null,
  });
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState(product?.name ?? prefill?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? (prefill?.name ? slugify(prefill.name) : ""));
  const [slugTouched, setSlugTouched] = useState(Boolean(product));

  /*
   * The colour swatch is a controlled input so the eyedropper can write to
   * it. useCallback keeps the identity stable — the uploader reports its
   * photos from an effect keyed on this, and a fresh function each render
   * would loop.
   */
  const [colorHex, setColorHex] = useState(product?.colorHex ?? "#171410");
  // Raw text while the hex field is being edited; null when not editing.
  const [hexDraft, setHexDraft] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>(
    (product?.images ?? prefill?.images ?? []).map((img) => img.publicUrl),
  );
  const handlePhotosChange = useCallback((urls: string[]) => setPhotos(urls), []);

  return (
    <form
      /*
       * Submitted via onSubmit, not <form action>. React 19 resets a form
       * after every action-prop submission — failed ones included — so a
       * validation error used to wipe the category, prices, colour, sizes,
       * description and checkboxes (and, when editing, silently put back
       * the old values). Dispatching by hand keeps what was typed.
       */
      onSubmit={(event) => {
        event.preventDefault();
        if (pending || uploading) return;
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
      }}
      className="max-w-2xl space-y-7"
    >
      {product && <input type="hidden" name="id" value={product.id} />}
      {!product && retailProductId && (
        <input type="hidden" name="retailProductId" value={retailProductId} />
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="u-caps text-muted block">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={160}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          placeholder="Ivory Embroidered Sherwani"
          className="u-field"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="slug" className="u-caps text-muted block">
          URL Slug
        </label>
        <input
          id="slug"
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          className="u-field font-mono text-sm"
        />
        <p className="text-muted text-xs">
          {SITE_HOST}/product/{slug || "…"} — changing this changes the public link.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="category" className="u-caps text-muted block">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={product?.category ?? prefill?.category ?? defaultCategory ?? ""}
            className="u-field"
          >
            <option value="" disabled>
              Choose one
            </option>
            {SHOP_CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="priceRupees" className="u-caps text-muted block">
            Price (PKR)
          </label>
          <input
            id="priceRupees"
            name="priceRupees"
            type="number"
            min={0}
            step={1}
            required
            defaultValue={product?.priceRupees}
            placeholder="145000"
            className="u-field"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="salePriceRupees" className="u-caps text-muted block">
          Sale price (PKR)
        </label>
        <input
          id="salePriceRupees"
          name="salePriceRupees"
          type="number"
          min={0}
          step={1}
          defaultValue={product?.salePriceRupees ?? ""}
          placeholder="Leave blank — not on sale"
          className="u-field"
        />
        <p className="text-muted text-xs">
          Must be lower than the regular price. Shows a Sale badge and a struck-through
          regular price on the storefront.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="colorName" className="u-caps text-muted block">
            Colour name
          </label>
          <input
            id="colorName"
            name="colorName"
            required
            defaultValue={product?.colorName ?? prefill?.colorName}
            placeholder="Ivory"
            className="u-field"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="colorHex" className="u-caps text-muted block">
            Colour swatch
          </label>

          {/*
           * The photo picker sits above the swatch, not below it. The
           * browser's native colour popup always opens downward from the
           * <input type="color"> and its position can't be controlled from
           * script — with the photo underneath, the popup covered the very
           * image you were trying to pick a colour out of.
           */}
          <ColorFromPhoto photos={photos} onPick={setColorHex} />

          <div className="flex items-center gap-3">
            <input
              id="colorHex"
              name="colorHex"
              type="color"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              className="border-line h-11 w-14 shrink-0 border p-1"
            />
            {/*
             * Typing or pasting a hex avoids the native popup altogether.
             * Unnamed on purpose — the colour input above carries the form
             * value; two fields sharing a name would submit twice.
             */}
            <input
              type="text"
              aria-label="Colour hex value"
              value={hexDraft ?? colorHex}
              onChange={(e) => setHexDraft(e.target.value)}
              onBlur={() => {
                const next = (hexDraft ?? "").trim().replace(/^#?/, "#");
                if (/^#[0-9a-fA-F]{6}$/.test(next)) setColorHex(next.toLowerCase());
                setHexDraft(null); // valid or not, snap back to the real value
              }}
              placeholder="#171410"
              className="u-field font-mono text-xs"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="sizes" className="u-caps text-muted block">
          Sizes
        </label>
        <input
          id="sizes"
          name="sizes"
          defaultValue={product?.sizes?.join(", ")}
          placeholder="S, M, L, XL, XXL"
          className="u-field"
        />
        <p className="text-muted text-xs">Comma-separated. Leave blank to use S, M, L, XL, XXL.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="tags" className="u-caps text-muted block">
          Tags
        </label>
        <input
          id="tags"
          name="tags"
          defaultValue={product?.tags?.join(", ")}
          placeholder="New Arrival, Bestseller"
          className="u-field"
        />
        <p className="text-muted text-xs">
          Comma-separated. Shown as small badges on the product card and page.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="u-caps text-muted block">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          defaultValue={product?.description ?? ""}
          placeholder="Leave blank to use the generated category copy. Separate paragraphs with a blank line."
          className="u-field"
        />
      </div>

      <ProductImagesUploader
        initialImages={product?.images ?? prefill?.images ?? []}
        onPhotosChange={handlePhotosChange}
        onUploadingChange={setUploading}
      />

      <div className="flex flex-wrap gap-6">
        <label className="inline-flex items-center gap-2.5">
          <input
            type="checkbox"
            name="readyToShip"
            defaultChecked={product?.readyToShip ?? false}
            className="accent-brass h-5 w-5"
          />
          <span className="u-caps text-espresso">Ready to ship</span>
        </label>
        <label className="inline-flex items-center gap-2.5">
          <input
            type="checkbox"
            name="storePickup"
            defaultChecked={product?.storePickup ?? false}
            className="accent-brass h-5 w-5"
          />
          <span className="u-caps text-espresso">Store pick-up</span>
        </label>
        <label className="inline-flex items-center gap-2.5">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product?.featured ?? false}
            className="accent-brass h-5 w-5"
          />
          <span className="u-caps text-espresso">Featured (Groom Edit)</span>
        </label>
      </div>

      {state.error && (
        <p role="alert" className="text-rust text-sm">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <SubmitButton label={submitLabel} pending={pending} uploading={uploading} />
        <Link href={cancelHref} className="u-btn-ghost u-caps">
          Cancel
        </Link>
      </div>
    </form>
  );
}
