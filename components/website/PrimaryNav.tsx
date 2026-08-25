"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PRIMARY_NAV, type NavColumn } from "@/lib/website/nav";

/**
 * Desktop mega-menu. State-driven rather than pure CSS `group-hover`,
 * specifically so it can be closed by something other than the mouse.
 *
 * The panel hangs below the nav row, and HeaderScrollBoundary slides the
 * whole header off the top on scroll-down — so a hover-only panel stayed
 * open and became an orphaned box floating at the top of the viewport with
 * no header attached to it. Closing on scroll is the fix; Escape and
 * clicking a link close it too, and focus moving out of the nav closes it
 * for keyboard users.
 */
export function PrimaryNav() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;

    function close() {
      setOpenIndex(null);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    window.addEventListener("scroll", close, { passive: true });
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", close);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openIndex]);

  const open = openIndex === null ? null : PRIMARY_NAV[openIndex];

  return (
    <nav
      aria-label="Primary"
      onMouseLeave={() => setOpenIndex(null)}
      onBlur={(e) => {
        // Keep the panel open while focus moves between the trigger and
        // the links inside it; close once focus leaves the nav entirely.
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setOpenIndex(null);
        }
      }}
      className="border-current/15 relative flex items-center justify-center gap-10 border-t px-8 py-2.5"
    >
      {PRIMARY_NAV.map((item, i) => (
        <div key={item.label} onMouseEnter={() => setOpenIndex(item.columns ? i : null)}>
          <Link
            href={item.href}
            aria-expanded={item.columns ? openIndex === i : undefined}
            onFocus={() => setOpenIndex(item.columns ? i : null)}
            onClick={() => setOpenIndex(null)}
            className={`u-caps hover:text-brass-deep border-b-2 pb-1 transition-colors ${
              openIndex === i ? "border-brass-deep" : "border-transparent"
            }`}
          >
            {item.label}
          </Link>
        </div>
      ))}

      {open?.columns && (
        <MegaPanel columns={open.columns} onNavigate={() => setOpenIndex(null)} />
      )}
    </nav>
  );
}

/**
 * Full-bleed mega-menu panel — spans the whole nav row's width (it's
 * `absolute` against `<nav>`, the nearest positioned ancestor, not against
 * one item's narrow wrapper), so it reads as one open surface rather than
 * a card floating under a single link. Columns align to the same container
 * used by the rest of the page.
 */
function MegaPanel({
  columns,
  onNavigate,
}: {
  columns: NavColumn[];
  onNavigate: () => void;
}) {
  return (
    <div className="border-current/15 absolute inset-x-0 top-full z-10 border-t border-b">
      <div className="bg-parchment text-espresso u-container flex flex-wrap gap-16 py-8">
        {columns.map((column) => (
          <div key={column.heading}>
            <p className="font-medium">{column.heading}</p>
            <ul className="mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className="text-muted hover:text-brass-deep text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
