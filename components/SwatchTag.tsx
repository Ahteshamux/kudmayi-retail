/**
 * The signature detail — a fabric swatch tag, the way a garment label is
 * stitched into a lining. The notch on the left edge is the "stitch".
 *
 * Shows the colour *name*, since colour is free text ("Ivory", "Deep Maroon")
 * rather than a hex value.
 */
export function SwatchTag({ color }: { color: string }) {
  return (
    <span className="border-brass/40 bg-espresso/85 text-parchment relative inline-flex items-center rounded-r-[2px] border border-l-0 py-1 pr-2.5 pl-3 backdrop-blur-sm">
      {/* the stitch */}
      <span
        aria-hidden
        className="bg-brass absolute top-1/2 left-1 h-3.5 w-px -translate-y-1/2"
      />
      <span className="u-caps text-[0.625rem] whitespace-nowrap">{color}</span>
    </span>
  );
}
