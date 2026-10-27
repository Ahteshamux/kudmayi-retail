"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { AutoGrowTextarea } from "./AutoGrowTextarea";
import { saveHomepageFraming, saveHomepageImage } from "@/app/admin/homepage/actions";
import {
  MAX_ZOOM,
  framingStyle,
  resolveFraming,
  type Framing,
  type FramingBreakpoint,
  type SlotFraming,
} from "@/lib/website/framing";
import { compressImage, FULL_BLEED_MAX_EDGE } from "@/lib/image";
import { createClient } from "@/lib/supabase/client";
import { STOREFRONT_BUCKET } from "@/lib/website/admin-products-shared";
import type { TierSpec } from "@/lib/website/homepage-slots";

export type SlotValue = {
  src: string;
  alt: string;
  tablet?: string;
  mobile?: string;
  framing?: SlotFraming;
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
  const [framing, setFraming] = useState<SlotFraming>(value.framing ?? {});
  const framingTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  /** Updates the preview at once; saves after a short pause in dragging. */
  function changeFraming(breakpoint: FramingBreakpoint, next: Framing | null) {
    setFraming((prev) => {
      const copy = { ...prev };
      if (next) copy[breakpoint] = next;
      else delete copy[breakpoint];
      return copy;
    });
    clearTimeout(framingTimers.current[breakpoint]);
    framingTimers.current[breakpoint] = setTimeout(() => {
      startTransition(async () => {
        const result = await saveHomepageFraming(slotKey, breakpoint, next);
        if (result.error) setError(result.error);
        else {
          setError(null);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }
      });
    }, 600);
  }
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
            framing={resolveFraming(framing, tier.breakpoint)}
            framingIsSet={Boolean(framing[tier.breakpoint])}
            onFramingChange={(next) => changeFraming(tier.breakpoint, next)}
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
  framing,
  framingIsSet,
  onFramingChange,
}: {
  tier: TierSpec;
  src?: string;
  fallbackSrc?: string;
  busy: boolean;
  onUpload: (file: File) => void;
  onClear: () => void;
  framing: Framing;
  framingIsSet: boolean;
  onFramingChange: (next: Framing | null) => void;
}) {
  const [adjusting, setAdjusting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isDesktop = tier.breakpoint === "desktop";
  const usingFallback = !src && !isDesktop;
  const shown = src ?? fallbackSrc;

  return (
    <div className="space-y-2">
      <p className="u-caps text-muted text-[0.625rem]">{tier.label}</p>

      {/* Shaped like the real tile (from the tier's "(w:h)" shape), with the
          framing applied — this is what shoppers see. */}
      <div
        className="bg-well border-line relative overflow-hidden border"
        style={{ aspectRatio: aspectFromShape(tier.shape) }}
      >
        {shown && (
          <Image
            src={shown}
            alt=""
            fill
            sizes="300px"
            className={`object-cover ${usingFallback ? "opacity-40" : ""}`}
            style={framingStyle(framing)}
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
        {shown && (
          <button
            type="button"
            onClick={() => setAdjusting((v) => !v)}
            className="u-caps text-brass-deep hover:underline"
          >
            {adjusting ? "Done" : "Adjust framing"}
          </button>
        )}
      </div>

      {adjusting && shown && (
        <FramingEditor
          src={shown}
          framing={framing}
          isSet={framingIsSet}
          onChange={onFramingChange}
        />
      )}
    </div>
  );
}

/** "Portrait (4:5)" → "4 / 5"; anything without a ratio previews at 3:4. */
function aspectFromShape(shape: string): string {
  const m = shape.match(/\((\d+(?:\.\d+)?):(\d+(?:\.\d+)?)\)/);
  return m ? `${m[1]} / ${m[2]}` : "3 / 4";
}

/**
 * Click the whole, uncropped photo to choose the point that must stay in
 * view (a face, usually); the slider zooms in around that point. The tile
 * preview above updates live and saves itself after a short pause.
 */
function FramingEditor({
  src,
  framing,
  isSet,
  onChange,
}: {
  src: string;
  framing: Framing;
  isSet: boolean;
  onChange: (next: Framing | null) => void;
}) {
  function pick(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    onChange({ ...framing, x: Math.round(x), y: Math.round(y) });
  }

  return (
    <div className="border-line bg-surface space-y-3 border p-3">
      <p className="text-muted text-xs leading-relaxed">
        Click the part of the photo that must always show, like the face.
      </p>
      <div className="flex justify-center">
        <div
          className="relative cursor-crosshair touch-none"
          onPointerDown={pick}
          onPointerMove={(e) => e.buttons === 1 && pick(e)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- a plain,
              uncropped image is needed so clicks map to photo coordinates */}
          <img src={src} alt="" draggable={false} className="block max-h-56 w-auto select-none" />
          <span
            aria-hidden
            className="border-parchment pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-[0_0_0_1px_rgba(0,0,0,0.5)]"
            style={{ left: `${framing.x}%`, top: `${framing.y}%` }}
          />
        </div>
      </div>
      <label className="block">
        <span className="text-muted text-xs">
          Zoom {Math.round(framing.zoom * 100)}%
        </span>
        <input
          type="range"
          min={1}
          max={MAX_ZOOM}
          step={0.05}
          value={framing.zoom}
          onChange={(e) => onChange({ ...framing, zoom: Number(e.target.value) })}
          className="accent-brass mt-1 block w-full"
        />
      </label>
      {isSet && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="u-caps text-muted hover:text-rust text-xs"
        >
          Reset to centred
        </button>
      )}
    </div>
  );
}
