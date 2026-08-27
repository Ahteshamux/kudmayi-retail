"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { AutoGrowTextarea } from "./AutoGrowTextarea";
import { saveHomepageImage } from "@/app/admin/homepage/actions";
import { compressImage, FULL_BLEED_MAX_EDGE } from "@/lib/image";
import { createClient } from "@/lib/supabase/client";
import { STOREFRONT_BUCKET } from "@/lib/website/admin-products-shared";
import type { TierSpec } from "@/lib/website/homepage-slots";

export type SlotValue = {
  src: string;
  alt: string;
  tablet?: string;
  mobile?: string;
};

/**
 * One photo slot. Most slots render the same shape at every screen width
 * and so show a single upload box; the few whose aspect ratio genuinely
 * changes (hero above all) show one box per screen size, each with its own
 * recommended dimensions.
 *
 * Saves the moment an upload finishes — with ~27 slots on one page, a
 * per-slot Save button would mean 27 clicks for a handful of real edits.
 */
export function HomepageImageSlot({
  slotKey,
  label,
  tiers,
  note,
  value,
}: {
  slotKey: string;
  label: string;
  tiers: TierSpec[];
  note?: string;
  value: SlotValue;
}) {
  const [urls, setUrls] = useState<Record<string, string | undefined>>({
    desktop: value.src,
    tablet: value.tablet,
    mobile: value.mobile,
  });
  const [altText, setAltText] = useState(value.alt);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function persist(breakpoint: string, nextSrc: string | null, nextAlt: string) {
    startTransition(async () => {
      const result = await saveHomepageImage(slotKey, breakpoint, nextSrc, nextAlt);
      if (result.error) {
        setError(result.error);
      } else {
        setError(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  }

  async function upload(breakpoint: string, file: File) {
    setError(null);
    setBusy(breakpoint);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Your session expired. Sign in again.");

      const blob = await compressImage(file, FULL_BLEED_MAX_EDGE);
      const path = `homepage/${slotKey}-${breakpoint}-${crypto.randomUUID()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from(STOREFRONT_BUCKET)
        .upload(path, blob, { contentType: "image/jpeg" });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(STOREFRONT_BUCKET).getPublicUrl(path);

      setUrls((prev) => ({ ...prev, [breakpoint]: publicUrl }));
      persist(breakpoint, publicUrl, altText);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      setBusy(null);
    }
  }

  function clear(breakpoint: string) {
    setUrls((prev) => ({ ...prev, [breakpoint]: undefined }));
    persist(breakpoint, null, altText);
  }

  return (
    <div className="border-line space-y-4 border p-4">
      <p className="u-caps text-espresso">{label}</p>
      {note && <p className="text-muted/80 text-xs leading-relaxed">{note}</p>}

      <div className={tiers.length > 1 ? "grid gap-4 sm:grid-cols-2" : ""}>
        {tiers.map((tier) => (
          <TierBox
            key={tier.breakpoint}
            tier={tier}
            src={urls[tier.breakpoint]}
            fallbackSrc={urls.desktop}
            busy={busy === tier.breakpoint}
            onUpload={(file) => upload(tier.breakpoint, file)}
            onClear={() => clear(tier.breakpoint)}
          />
        ))}
      </div>

      <label className="block">
        <span className="text-muted text-xs">Alt text</span>
        <AutoGrowTextarea
          value={altText}
          onChange={setAltText}
          onBlur={() => persist("desktop", urls.desktop ?? null, altText)}
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

function TierBox({
  tier,
  src,
  fallbackSrc,
  busy,
  onUpload,
  onClear,
}: {
  tier: TierSpec;
  src?: string;
  fallbackSrc?: string;
  busy: boolean;
  onUpload: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isDesktop = tier.breakpoint === "desktop";
  const usingFallback = !src && !isDesktop;
  const shown = src ?? fallbackSrc;

  return (
    <div className="space-y-2">
      <p className="u-caps text-muted text-[0.625rem]">{tier.label}</p>

      <div className="bg-well border-line relative aspect-[3/4] overflow-hidden border">
        {shown && (
          <Image
            src={shown}
            alt=""
            fill
            sizes="200px"
            className={`object-cover ${usingFallback ? "opacity-40" : ""}`}
          />
        )}
        {busy && (
          <div className="bg-parchment/85 u-caps text-espresso absolute inset-0 flex items-center justify-center text-center text-xs">
            Uploading…
          </div>
        )}
        {usingFallback && !busy && (
          <div className="bg-parchment/70 u-caps text-muted absolute inset-0 flex items-center justify-center p-2 text-center text-[0.625rem] leading-relaxed">
            Using desktop image
          </div>
        )}
      </div>

      <p className="text-muted text-xs leading-relaxed">
        <span className="text-espresso font-medium">{tier.recommended} px</span>
        <br />
        {tier.shape}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          e.target.value = "";
        }}
        className="hidden"
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="u-caps text-brass-deep hover:underline disabled:opacity-50"
        >
          {src ? "Replace" : "Upload"}
        </button>
        {src && !isDesktop && (
          <button
            type="button"
            onClick={onClear}
            className="u-caps text-muted hover:text-rust"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
