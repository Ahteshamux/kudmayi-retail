/* Small line icons, kept local — a whole icon-library dependency isn't
   worth it for a handful of glyphs. Shared across the header and the shop
   listing pages so there's one definition of each. */

export function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-[18px] w-[18px]" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="6" />
      <path d="M17 17l-4-4" strokeLinecap="round" />
    </svg>
  );
}

export function AccountIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-[18px] w-[18px]" aria-hidden="true">
      <circle cx="10" cy="6.5" r="3.5" />
      <path d="M3 17c1.2-3.5 4-5.5 7-5.5s5.8 2 7 5.5" strokeLinecap="round" />
    </svg>
  );
}

export function HeartIcon({
  className = "h-[18px] w-[18px]",
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.4"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 17S2.8 12.3 2.8 7.2C2.8 4.6 4.9 3 7.1 3c1.2 0 2.3.6 2.9 1.6C10.6 3.6 11.7 3 12.9 3c2.2 0 4.3 1.6 4.3 4.2 0 5.1-7.2 9.8-7.2 9.8Z" strokeLinejoin="round" />
    </svg>
  );
}

export function BagIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-[18px] w-[18px]" aria-hidden="true">
      <path d="M5 7h10l.8 10.2a1 1 0 0 1-1 1.08H5.2a1 1 0 0 1-1-1.08L5 7Z" strokeLinejoin="round" />
      <path d="M7.2 7V5.6a2.8 2.8 0 1 1 5.6 0V7" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronDownIcon({ className = "h-2.5 w-2.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden="true">
      <path d="M1 1.5 6 6.5 11 1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GridIcon({ dense = false }: { dense?: boolean }) {
  const cells = dense ? 6 : 4;
  return (
    <svg viewBox="0 0 18 18" fill="currentColor" className="h-[15px] w-[15px]" aria-hidden="true">
      {Array.from({ length: cells }).map((_, i) => {
        const cols = dense ? 3 : 2;
        const size = dense ? 4.5 : 7;
        const gap = dense ? 1.5 : 2;
        const x = (i % cols) * (size + gap);
        const y = Math.floor(i / cols) * (size + gap);
        return <rect key={i} x={x} y={y} width={size} height={size} />;
      })}
    </svg>
  );
}
