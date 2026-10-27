import { getImageProps } from "next/image";
import { resolveFraming } from "@/lib/website/framing";
import type { HomepageImage } from "@/lib/website/homepage-content";

/**
 * Renders a homepage photo that has per-breakpoint crops.
 *
 * Uses <picture> with media queries rather than three <Image> elements
 * toggled by CSS: `display:none` does not reliably stop a browser
 * downloading an image, so the CSS approach would make phones pay for the
 * desktop file they never see. <picture> lets the browser pick exactly
 * one candidate before any download starts.
 *
 * getImageProps() gives each candidate the full next/image treatment —
 * resizing, AVIF/WebP negotiation, the generated srcSet — which a bare
 * <img> would lose. Breakpoints match Tailwind's: mobile is below 640px,
 * tablet 640–1023px, desktop 1024px and up.
 */
export function ResponsiveSlotImage({
  image,
  sizes,
  className = "",
  priority = false,
}: {
  image: HomepageImage;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  /*
   * quality: 90, not the framework default of 75. These images render at
   * up to 100vw on the largest, most scrutinised frame on the site — the
   * hero above all — after already passing through one lossy JPEG encode
   * on upload (see compressImage in lib/image.ts). Re-encoding that
   * already-compressed source a second time at 75 compounds the loss
   * visibly; 90 stops adding a second round of it. Declared in
   * next.config.ts's images.qualities, which Next requires for any value
   * beyond the default.
   */
  const common = { alt: image.alt, sizes, fill: true, priority, quality: 90 } as const;

  const desktop = getImageProps({ ...common, src: image.src });
  const tablet = image.tablet ? getImageProps({ ...common, src: image.tablet }) : null;
  const mobile = image.mobile ? getImageProps({ ...common, src: image.mobile }) : null;

  return (
    <picture>
      {mobile && (
        <source
          media="(max-width: 639px)"
          srcSet={mobile.props.srcSet}
          sizes={mobile.props.sizes}
        />
      )}
      {tablet && (
        <source
          media="(min-width: 640px) and (max-width: 1023px)"
          srcSet={tablet.props.srcSet}
          sizes={tablet.props.sizes}
        />
      )}
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from {...desktop.props} */}
      <img
        {...desktop.props}
        // Only when the admin has set framing — otherwise the caller's own
        // object-position (e.g. the hero's lg:object-top) stays in charge.
        className={image.framing ? `${className} ${FRAMING_CLASSES}` : className}
        style={image.framing ? { ...desktop.props.style, ...framingVars(image) } : desktop.props.style}
      />
    </picture>
  );
}

/*
 * Admin-set framing (focus point + zoom), one value per breakpoint. The
 * <picture> above swaps the *file* per breakpoint but there is only one
 * <img>, so the per-breakpoint position/zoom ride on CSS variables that
 * these media-query classes pick between. Breakpoints match the <source>
 * media queries: mobile < 640px, tablet 640–1023px, desktop ≥ 1024px.
 * `transform` composes with Tailwind's hover `scale-*` (a separate
 * property), so tile hover-zoom still works on top.
 */
const FRAMING_CLASSES =
  "[object-position:var(--fp-m)] [transform-origin:var(--fp-m)] [transform:scale(var(--fz-m))] " +
  "sm:[object-position:var(--fp-t)] sm:[transform-origin:var(--fp-t)] sm:[transform:scale(var(--fz-t))] " +
  "lg:[object-position:var(--fp-d)] lg:[transform-origin:var(--fp-d)] lg:[transform:scale(var(--fz-d))]";

function framingVars(image: HomepageImage): React.CSSProperties {
  const vars: Record<string, string> = {};
  for (const [bp, k] of [["mobile", "m"], ["tablet", "t"], ["desktop", "d"]] as const) {
    const f = resolveFraming(image.framing, bp);
    vars[`--fp-${k}`] = `${f.x}% ${f.y}%`;
    vars[`--fz-${k}`] = String(f.zoom);
  }
  return vars as React.CSSProperties;
}
