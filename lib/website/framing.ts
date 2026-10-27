/**
 * Admin-set framing for a homepage photo: which point of the photo must
 * stay in view (x/y, % of the photo) and how far to zoom in. Stored per
 * breakpoint because a tile changes shape between phone and desktop.
 *
 * Pure data + helpers — imported by the DB schema, the storefront and the
 * admin, so it must not pull in anything server-only.
 */
export type Framing = { x: number; y: number; zoom: number };
export type FramingBreakpoint = "desktop" | "tablet" | "mobile";
export type SlotFraming = Partial<Record<FramingBreakpoint, Framing>>;

export const DEFAULT_FRAMING: Framing = { x: 50, y: 50, zoom: 1 };
export const MAX_ZOOM = 2;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Validates untrusted input (a Server Action argument) into a Framing. */
export function parseFraming(value: unknown): Framing | null {
  if (!value || typeof value !== "object") return null;
  const { x, y, zoom } = value as Record<string, unknown>;
  if (![x, y, zoom].every((n) => typeof n === "number" && Number.isFinite(n))) return null;
  return {
    x: Math.round(clamp(x as number, 0, 100) * 10) / 10,
    y: Math.round(clamp(y as number, 0, 100) * 10) / 10,
    zoom: Math.round(clamp(zoom as number, 1, MAX_ZOOM) * 100) / 100,
  };
}

/** Phones fall back to tablet, tablet to desktop, desktop to centred. */
export function resolveFraming(f: SlotFraming | undefined, bp: FramingBreakpoint): Framing {
  if (bp === "mobile") return f?.mobile ?? f?.tablet ?? f?.desktop ?? DEFAULT_FRAMING;
  if (bp === "tablet") return f?.tablet ?? f?.desktop ?? DEFAULT_FRAMING;
  return f?.desktop ?? DEFAULT_FRAMING;
}

/** Inline style for one breakpoint's framing on an object-cover <img>. */
export function framingStyle(f: Framing): React.CSSProperties {
  const origin = `${f.x}% ${f.y}%`;
  return {
    objectPosition: origin,
    transformOrigin: origin,
    transform: f.zoom > 1 ? `scale(${f.zoom})` : undefined,
  };
}
