"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades a section's headline/copy block up into place the first time it
 * scrolls into view. One instance per section, not per element — a whole
 * block moving together reads as intentional; a dozen staggered fragments
 * reads as a demo reel. Defaults to visible (see .reveal in globals.css),
 * so no-JS and prefers-reduced-motion users see the finished content.
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
