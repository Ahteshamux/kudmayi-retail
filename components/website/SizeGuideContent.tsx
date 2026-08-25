/** Shared sizing chart — the standard S–XXL run every product falls back
 *  to (see lib/website/category-copy.ts's sizesForCategory). Generic
 *  measurements, since most pieces are made or altered to order. */
const ROWS: { size: string; chest: string; length: string; shoulder: string }[] = [
  { size: "S", chest: "38–39", length: "42", shoulder: "17.5" },
  { size: "M", chest: "40–41", length: "43", shoulder: "18" },
  { size: "L", chest: "42–43", length: "44", shoulder: "18.5" },
  { size: "XL", chest: "44–45", length: "45", shoulder: "19" },
  { size: "XXL", chest: "46–47", length: "46", shoulder: "19.5" },
];

export function SizeGuideContent() {
  return (
    <>
      <p>
        All measurements are in inches, taken flat. These are a starting point —
        every piece can be tailored to your exact measurements at no extra cost
        before it ships.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[22rem] text-left text-sm">
          <thead>
            <tr className="border-line border-b">
              <th className="u-caps py-2 pr-3 font-medium">Size</th>
              <th className="u-caps py-2 pr-3 font-medium">Chest</th>
              <th className="u-caps py-2 pr-3 font-medium">Length</th>
              <th className="u-caps py-2 font-medium">Shoulder</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.size} className="border-line border-b last:border-b-0">
                <td className="text-espresso py-2 pr-3">{row.size}</td>
                <td className="py-2 pr-3">{row.chest}</td>
                <td className="py-2 pr-3">{row.length}</td>
                <td className="py-2">{row.shoulder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Between sizes, or ordering bespoke? Send your chest, length, and shoulder
        measurements on WhatsApp and we&rsquo;ll confirm fit before cutting.
      </p>
    </>
  );
}
