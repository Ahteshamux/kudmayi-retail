"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Eyedropper over the product's own photographs.
 *
 * The browser's native <input type="color"> has an eyedropper, but it
 * samples the whole screen, which macOS gates behind a Screen Recording
 * permission — so in practice it silently does nothing and the hex has to
 * be typed by hand. This sidesteps that: the photo is drawn to a canvas and
 * the pixel under the click is read directly.
 *
 * Reading pixels back out of a canvas requires the image to be CORS-clean.
 * Supabase Storage serves public objects with access-control-allow-origin:*,
 * so crossOrigin="anonymous" is enough. If a photo ever fails that check the
 * canvas is tainted and getImageData throws — caught below and reported,
 * rather than left as a dead click.
 */

function toHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");
}

export function ColorFromPhoto({
  photos,
  onPick,
}: {
  photos: string[];
  onPick: (hex: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const src = photos[index];

  // Draw the selected photo whenever the picker opens or the photo changes.
  useEffect(() => {
    if (!open || !src) return;
    let cancelled = false;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      // Cap the drawing surface: a 4000px camera file gains nothing here
      // and costs memory on a phone.
      const scale = Math.min(1, 900 / Math.max(img.width, img.height));
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      setError(null);
    };
    img.onerror = () => {
      if (!cancelled) setError("Couldn't load that photo.");
    };
    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [open, src]);

  function readPixel(event: React.MouseEvent<HTMLCanvasElement>): string | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    // The canvas is displayed at CSS size but holds its own pixel grid.
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * canvas.height);
    try {
      const [r, g, b] = canvas.getContext("2d")!.getImageData(x, y, 1, 1).data;
      return toHex(r, g, b);
    } catch {
      setError("This photo can't be sampled — its server blocks pixel reads.");
      return null;
    }
  }

  if (photos.length === 0) {
    return (
      <p className="text-muted text-sm">
        Add a photo below to pick the colour from it.
      </p>
    );
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="u-btn-ghost u-caps">
        Pick from photo
      </button>
    );
  }

  return (
    <div className="border-line bg-surface space-y-3 border p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="u-caps text-muted">Click the colour you want</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="u-caps text-muted hover:text-espresso px-2 py-1 transition-colors"
        >
          Close
        </button>
      </div>

      {photos.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {photos.map((p, i) => (
            <button
              key={p}
              type="button"
              onClick={() => setIndex(i)}
              className={`u-caps border px-2 py-1 transition-colors ${
                i === index ? "border-brass text-espresso" : "border-line text-muted"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <canvas
        ref={canvasRef}
        onMouseMove={(e) => setHover(readPixel(e))}
        onMouseLeave={() => setHover(null)}
        onClick={(e) => {
          const hex = readPixel(e);
          if (hex) {
            onPick(hex);
            setOpen(false);
          }
        }}
        className="block max-h-[320px] w-full cursor-crosshair object-contain"
      />

      {hover && (
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="border-line inline-block h-5 w-5 border"
            style={{ backgroundColor: hover }}
          />
          <span className="text-muted font-mono text-xs">{hover}</span>
        </div>
      )}

      {error && (
        <p role="alert" className="text-rust text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
