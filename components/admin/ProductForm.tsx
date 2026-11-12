"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useActionState, useCallback, useMemo, useState } from "react";
import { ColorFromPhoto } from "./ColorFromPhoto";
import { ProductImagesUploader } from "./ProductImagesUploader";
import { slugify, type ActionState, type ImageInput } from "@/lib/website/admin-products-shared";
import { GROOM_EDIT_LIMIT, MAX_ADDONS, SITE_HOST } from "@/lib/website/constants";
import { formatPKR } from "@/lib/website/format";
import {
  ACCESSORY_CATEGORIES,
  ADDON_CATEGORIES,
  CLOTHING_CATEGORIES,
  SARBALA_CATEGORY,
  SHOP_CATEGORIES,
} from "@/lib/website/categories";
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

/** A product that can be ticked as an add-on on another product. */
export type AddonOption = {
  id: string;
  name: string;
  category: string;
  image: string | null;
  priceRupees: number;
  /** Hidden from the shop — still pairable, flagged in the picker. */
  published?: boolean;
};

const ADDON_SLUGS: readonly string[] = ADDON_CATEGORIES.map((c) => c.slug);

/** A piece currently holding a fixed Groom Edit slot. */
export type GroomEditSlot = { position: number; slug: string; name: string };

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
  groomEditSlots = [],
  addonOptions = [],
  selectedAddonIds = [],
  pairedWithIds = [],
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
  /** Who holds each fixed Groom Edit slot, for the position picker. */
  groomEditSlots?: GroomEditSlot[];
  /** Everything offerable as an add-on, and what this product already has. */
  addonOptions?: AddonOption[];
  selectedAddonIds?: string[];
  /** For an add-on piece: the products whose pages already offer it. */
  pairedWithIds?: string[];
  submitLabel: string;
  cancelHref: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {
    error: null,
  });
  const [uploading, setUploading] = useState(false);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [name, setName] = useState(product?.name ?? prefill?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? (prefill?.name ? slugify(prefill.name) : ""));
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [category, setCategory] = useState<string>(
    product?.category ?? prefill?.category ?? defaultCategory ?? "",
  );
  const isAddonPiece = ADDON_SLUGS.includes(category);

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
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="u-field"
          >
            <option value="" disabled>
              Choose one
            </option>
            <optgroup label="Clothing">
              {CLOTHING_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Kids">
              <option value={SARBALA_CATEGORY.slug}>{SARBALA_CATEGORY.label}</option>
            </optgroup>
            <optgroup label="Accessories">
              {ACCESSORY_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </optgroup>
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
        <p className="text-muted text-xs">Comma-separated. If blank: clothing uses S–XXL, sarbala uses ages 2–12, footwear uses 39–45, turbans show no size.</p>
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
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="accent-brass h-5 w-5"
          />
          <span className="u-caps text-espresso">Featured (Groom Edit)</span>
        </label>
      </div>

      {featured && (
        <GroomEditPosition
          current={product?.featuredPosition ?? null}
          slots={groomEditSlots}
          selfSlug={product?.slug}
        />
      )}

      {isAddonPiece ? (
        <GoesWithPicker
          options={addonOptions.filter((o) => o.id !== product?.id)}
          initial={pairedWithIds}
        />
      ) : category ? (
        <AddonPicker
          options={addonOptions.filter((o) => o.id !== product?.id && ADDON_SLUGS.includes(o.category))}
          selected={selectedAddonIds}
        />
      ) : null}

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

/**
 * Picks this piece's slot in the homepage Groom Edit. Each option names
 * the piece holding that slot now, so the admin can see the running order
 * without leaving the form. Choosing a taken slot moves its holder to Auto
 * (handled on save in app/admin/products/actions.ts).
 */
function GroomEditPosition({
  current,
  slots,
  selfSlug,
}: {
  current: number | null;
  slots: GroomEditSlot[];
  selfSlug?: string;
}) {
  const holder = new Map(slots.map((s) => [s.position, s]));
  return (
    <div className="space-y-2">
      <label htmlFor="featuredPosition" className="u-caps text-muted block">
        Position in the Groom Edit
      </label>
      <select
        id="featuredPosition"
        name="featuredPosition"
        defaultValue={current ?? ""}
        className="u-field max-w-sm"
      >
        <option value="">Auto — fills a free spot, newest first</option>
        {Array.from({ length: GROOM_EDIT_LIMIT }, (_, i) => i + 1).map((n) => {
          const taken = holder.get(n);
          const label =
            !taken || taken.slug === selfSlug ? `${n}` : `${n} — now ${taken.name}`;
          return (
            <option key={n} value={n}>
              {label}
            </option>
          );
        })}
      </select>
      <p className="text-muted text-xs">
        The homepage shows {GROOM_EDIT_LIMIT} featured pieces, 4 per row. Picking a number
        another piece has moves that piece to Auto.
      </p>
    </div>
  );
}

/**
 * Ticks which turbans, footwear and sarbala outfits are offered under "Complete
 * the look" on this product's page. Plain checkboxes named `addonIds`; the
 * save action replaces the product's list with whatever is ticked.
 */
function AddonPicker({ options, selected }: { options: AddonOption[]; selected: string[] }) {
  return (
    <fieldset className="space-y-3">
      <input type="hidden" name="addonsSubmitted" value="1" />
      <legend className="u-caps text-muted">Complete the look (add-ons)</legend>
      <p className="text-muted text-xs">
        Tick up to {MAX_ADDONS} pieces to offer on this product&rsquo;s page, like the matching
        turban, footwear and sarbala outfit.
      </p>
      {options.length === 0 ? (
        <p className="text-muted text-sm">
          Add a product under Sarbala, Turbans or Groom Footwear and it will appear here.
        </p>
      ) : (
        ADDON_CATEGORIES.map((category) => {
          const items = options.filter((o) => o.category === category.slug);
          if (items.length === 0) return null;
          return (
            <div key={category.slug}>
              <p className="text-espresso mb-1.5 text-sm font-medium">{category.label}</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {items.map((option) => (
                  <li key={option.id}>
                    <label className="border-line bg-surface has-checked:border-brass-deep flex cursor-pointer items-center gap-3 border p-2">
                      <input
                        type="checkbox"
                        name="addonIds"
                        value={option.id}
                        defaultChecked={selected.includes(option.id)}
                        className="accent-brass h-5 w-5 shrink-0"
                      />
                      <span className="bg-well relative h-14 w-10 shrink-0 overflow-hidden">
                        {option.image && (
                          <Image src={option.image} alt="" fill sizes="40px" className="object-cover" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm">{option.name}</span>
                        <span className="text-muted block text-xs">
                          {formatPKR(option.priceRupees)}
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      )}
    </fieldset>
  );
}

/**
 * For an add-on piece (turban, footwear, sarbala): ticks which products'
 * pages offer it under "Complete the look" — the other side of AddonPicker,
 * so one turban can be tied to every sherwani in one save. Grouped by
 * category with "Tick all" per group and a search box. Selection lives in
 * state and is submitted as hidden `pairedWithIds` inputs, so pieces hidden
 * by the search or a collapsed group still count.
 */
function GoesWithPicker({ options, initial }: { options: AddonOption[]; initial: string[] }) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initial));
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<string>>(() => new Set());

  const groups = useMemo(
    () =>
      SHOP_CATEGORIES.map((c) => ({
        ...c,
        items: options.filter((o) => o.category === c.slug),
      })).filter((g) => g.items.length > 0),
    [options],
  );
  const q = query.trim().toLowerCase();

  const setMany = (ids: string[], on: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        if (on) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  const toggleOpen = (slug: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });

  return (
    <fieldset className="space-y-3">
      <input type="hidden" name="pairingsSubmitted" value="1" />
      {[...selected].map((id) => (
        <input key={id} type="hidden" name="pairedWithIds" value={id} />
      ))}
      <legend className="u-caps text-muted">Goes with (complete the look)</legend>
      <p className="text-muted text-xs">
        Tick the products this piece should be offered with. It shows under &ldquo;Complete the
        look&rdquo; on each ticked product&rsquo;s page. Use &ldquo;Tick all&rdquo; to tie it to a
        whole category at once.
      </p>

      {groups.length === 0 ? (
        <p className="text-muted text-sm">No other products yet.</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              aria-label="Search products to pair with"
              className="u-field max-w-xs flex-1"
            />
            <span className="text-muted text-xs">{selected.size} ticked</span>
            {selected.size > 0 && (
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="text-muted text-xs underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-2">
            {groups.map((group) => {
              const ids = group.items.map((o) => o.id);
              const count = ids.filter((id) => selected.has(id)).length;
              const allOn = count === ids.length;
              const visible = q
                ? group.items.filter((o) => o.name.toLowerCase().includes(q))
                : group.items;
              if (q && visible.length === 0) return null;
              const expanded = Boolean(q) || open.has(group.slug);
              return (
                <div key={group.slug} className="border-line border">
                  <div className="flex flex-wrap items-center gap-3 p-2.5">
                    <button
                      type="button"
                      onClick={() => toggleOpen(group.slug)}
                      aria-expanded={expanded}
                      className="text-espresso flex min-w-0 flex-1 items-center gap-2 text-left text-sm font-medium"
                    >
                      <span aria-hidden className="text-muted w-3">
                        {expanded ? "\u25BE" : "\u25B8"}
                      </span>
                      {group.label}
                      <span className="text-muted text-xs font-normal">
                        {count} of {ids.length}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMany(ids, !allOn)}
                      className="u-caps text-brass-deep text-xs"
                    >
                      {allOn ? "Untick all" : "Tick all"}
                    </button>
                  </div>
                  {expanded && (
                    <ul className="grid gap-2 p-2.5 pt-0 sm:grid-cols-2">
                      {visible.map((option) => (
                        <li key={option.id}>
                          <label className="border-line bg-surface has-checked:border-brass-deep flex cursor-pointer items-center gap-3 border p-2">
                            <input
                              type="checkbox"
                              checked={selected.has(option.id)}
                              onChange={(e) => setMany([option.id], e.target.checked)}
                              className="accent-brass h-5 w-5 shrink-0"
                            />
                            <span className="bg-well relative h-14 w-10 shrink-0 overflow-hidden">
                              {option.image && (
                                <Image
                                  src={option.image}
                                  alt=""
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              )}
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-sm">{option.name}</span>
                              <span className="text-muted block text-xs">
                                {formatPKR(option.priceRupees)}
                                {option.published === false && " · hidden from shop"}
                              </span>
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </fieldset>
  );
}
