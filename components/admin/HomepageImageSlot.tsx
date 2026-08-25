"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { AutoGrowTextarea } from "./AutoGrowTextarea";
import { saveHomepageImage } from "@/app/admin/homepage/actions";
import { compressImage, FULL_BLEED_MAX_EDGE } from "@/lib/image";
import { createClient } from "@/lib/supabase/client";
import { STOREFRONT_BUCKET } from "@/lib/website/admin-products-shared";

/**
 * One photo slot: current image, a "Replace" picker, an alt-text field.
 * Saves itself the moment a new photo finishes uploading — with ~27 of
 * these on one admin page, a per-slot "Save" button would mean 27 clicks
 * for a handful of real changes.
 */
export function HomepageImageSlot({
  slotKey,
  label,
  recommended,
  shape,
  note,
  currentSrc,
  currentAlt,
}: {
  slotKey: string;
  label: string;
  recommended: string;
  shape: string;
  note?: string;
  currentSrc: string;
  currentAlt: string;
}) {
  const [src, setSrc] = useState(currentSrc);
  const [altText, setAltText] = useState(currentAlt);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function persist(nextSrc: string, nextAlt: string) {
    startTransition(async () => {
      const result = await saveHomepageImage(slotKey, nextSrc, nextAlt);
      if (result.error) {
        setError(result.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      // Homepage photography is full-bleed, so it needs a higher ceiling
      // than the product-photo default.
      const blob = await compressImage(file, FULL_BLEED_MAX_EDGE);
      const localUrl = URL.createObjectURL(blob);
      setSrc(localUrl);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Your session expired. Sign in again.");

      const path = `homepage/${slotKey}-${crypto.randomUUID()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from(STOREFRONT_BUCKET)
        .upload(path, blob, { contentType: "image/jpeg" });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(STOREFRONT_BUCKET).getPublicUrl(path);

      setSrc(publicUrl);
      persist(publicUrl, altText);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="bg-well border-line relative aspect-[4/5] overflow-hidden border">
        {/* Local blob preview mid-upload — next/image can't optimise it. */}
        {src.startsWith("blob:") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          <Image src={src} alt="" fill sizes="200px" className="object-cover" />
        )}
        {uploading && (
          <div className="bg-parchment/85 u-caps text-espresso absolute inset-0 flex items-center justify-center text-center text-xs">
            Uploading…
          </div>
        )}
      </div>

      <p className="u-caps text-muted text-xs">{label}</p>

      {/* Sizing guidance, so nobody has to guess what to export. */}
      <p className="text-muted text-xs leading-relaxed">
        <span className="text-espresso font-medium">{recommended} px</span> or larger
        <br />
        {shape}
      </p>
      {note && <p className="text-muted/80 text-xs leading-relaxed">{note}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
        id={`slot-${slotKey}`}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="u-caps text-brass-deep hover:underline"
      >
        Replace
      </button>

      <label className="block">
        <span className="text-muted text-xs">Alt text</span>
        <AutoGrowTextarea
          value={altText}
          onChange={setAltText}
          onBlur={() => persist(src, altText)}
          placeholder="Describe the photo"
          className="mt-1 text-xs"
        />
      </label>

      {isPending && <p className="text-muted text-xs">Saving…</p>}
      {saved && !isPending && <p className="text-sage text-xs">Saved.</p>}
      {error && (
        <p role="alert" className="text-rust text-xs">
          {error}
        </p>
      )}
    </div>
  );
}
