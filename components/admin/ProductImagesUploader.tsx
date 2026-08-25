"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { compressImage } from "@/lib/image";
import { createClient } from "@/lib/supabase/client";
import { STOREFRONT_BUCKET, type ImageInput } from "@/lib/website/admin-products-shared";

type GalleryImage = ImageInput & { key: string };

/**
 * Multi-image drag-free uploader: add, reorder (▲▼), delete, and set alt
 * text per image. The lowest position is the cover image (matches the
 * "lowest sort_order" convention in lib/db/schema.ts) — labelled, not
 * separately toggled.
 *
 * Two hidden inputs carry state to the enclosing form's Server Action:
 * `images` (the full current list, in order) and `removedImagePaths`
 * (storage paths to clean up on submit — only ones that were actually
 * uploaded to Storage, not http(s) placeholder URLs from seed data).
 */
export function ProductImagesUploader({
  initialImages,
}: {
  initialImages: ImageInput[];
}) {
  const [images, setImages] = useState<GalleryImage[]>(() =>
    initialImages.map((img) => ({ ...img, key: crypto.randomUUID() })),
  );
  const [removedPaths, setRemovedPaths] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setError(null);
    setUploading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Your session expired. Sign in again.");

      const uploaded: GalleryImage[] = [];
      for (const file of files) {
        const blob = await compressImage(file);
        const path = `${crypto.randomUUID()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from(STOREFRONT_BUCKET)
          .upload(path, blob, { contentType: "image/jpeg" });
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from(STOREFRONT_BUCKET).getPublicUrl(path);

        uploaded.push({
          key: crypto.randomUUID(),
          storagePath: path,
          publicUrl,
          altText: "",
        });
      }

      setImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(key: string) {
    setImages((prev) => {
      const target = prev.find((img) => img.key === key);
      if (target && !target.storagePath.startsWith("http")) {
        setRemovedPaths((paths) => [...paths, target.storagePath]);
      }
      return prev.filter((img) => img.key !== key);
    });
  }

  function move(key: string, delta: number) {
    setImages((prev) => {
      const index = prev.findIndex((img) => img.key === key);
      const target = index + delta;
      if (index === -1 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function setAltText(key: string, altText: string) {
    setImages((prev) => prev.map((img) => (img.key === key ? { ...img, altText } : img)));
  }

  return (
    <div className="space-y-3">
      <span className="u-caps text-muted block">Photos</span>

      {images.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img, i) => (
            <li key={img.key} className="border-line bg-well border">
              <div className="relative aspect-[3/4]">
                <Image src={img.publicUrl} alt="" fill sizes="200px" className="object-cover" />
                {i === 0 && (
                  <span className="u-caps bg-brass-deep text-parchment absolute top-2 left-2 px-2 py-1 text-[0.625rem]">
                    Cover
                  </span>
                )}
              </div>
              <div className="space-y-2 p-2.5">
                <input
                  type="text"
                  value={img.altText}
                  onChange={(e) => setAltText(img.key, e.target.value)}
                  placeholder="Alt text"
                  className="u-field text-xs"
                />
                <div className="flex items-center justify-between gap-1">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(img.key, -1)}
                      disabled={i === 0}
                      aria-label="Move earlier"
                      className="u-caps text-muted hover:text-espresso px-1.5 py-1 disabled:opacity-30"
                    >
                      &uarr;
                    </button>
                    <button
                      type="button"
                      onClick={() => move(img.key, 1)}
                      disabled={i === images.length - 1}
                      aria-label="Move later"
                      className="u-caps text-muted hover:text-espresso px-1.5 py-1 disabled:opacity-30"
                    >
                      &darr;
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(img.key)}
                    className="u-caps text-muted hover:text-rust px-1.5 py-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
        id="product-images-input"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="u-btn-ghost u-caps"
      >
        {uploading ? "Uploading…" : "Add photos"}
      </button>

      {error && (
        <p role="alert" className="text-rust text-sm">
          {error}
        </p>
      )}

      <input
        type="hidden"
        name="images"
        value={JSON.stringify(images.map(({ storagePath, publicUrl, altText }) => ({ storagePath, publicUrl, altText })))}
        readOnly
      />
      <input type="hidden" name="removedImagePaths" value={removedPaths.join(",")} readOnly />
    </div>
  );
}
