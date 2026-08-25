"use client";

import { useState } from "react";

/**
 * Genuinely functional, not decorative — uses the Web Share API where
 * available (most mobile browsers), falling back to copying the link.
 * Needs no backend, unlike most of this page's other controls.
 */
export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled the share sheet — not an error
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — nothing more we can do silently
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label="Share this product"
      className="text-muted hover:text-espresso relative shrink-0 transition-colors"
    >
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-[18px] w-[18px]" aria-hidden="true">
        <circle cx="15" cy="4.5" r="2.2" />
        <circle cx="5" cy="10" r="2.2" />
        <circle cx="15" cy="15.5" r="2.2" />
        <path d="M6.9 8.8 13.1 5.7M6.9 11.2 13.1 14.3" strokeLinecap="round" />
      </svg>
      {copied && (
        <span className="u-caps bg-espresso text-parchment absolute top-full right-0 mt-2 px-2 py-1 whitespace-nowrap">
          Link copied
        </span>
      )}
    </button>
  );
}
