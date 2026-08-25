"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Positions the whole fixed header stack — announcement bar + nav — over
 * the page. Always solid parchment (no more transparent-over-hero state);
 * instead the whole stack slides off the top on scroll-down and slides
 * back on scroll-up, the classic "hide while reading, reveal on the way
 * back up" pattern. Stays shown near the very top of the page regardless
 * of direction, so it doesn't vanish the instant a tall hero starts
 * scrolling.
 *
 * The only client-side logic in the header: a passive scroll listener,
 * rAF-throttled so it doesn't run more than once per frame. SiteHeader
 * itself stays a Server Component — only this positioning shell is client.
 */
export function HeaderScrollBoundary({
  announcementBar,
  children,
}: {
  announcementBar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    let ticking = false;

    function handleScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < 80) {
          setHidden(false);
        } else {
          setHidden(y > lastY.current);
        }
        lastY.current = y;
        ticking = false;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-30 transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {announcementBar}
      <header className="bg-parchment text-espresso">{children}</header>
    </div>
  );
}
