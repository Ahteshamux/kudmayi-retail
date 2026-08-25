"use client";

import { whatsAppLink } from "@/lib/website/whatsapp";

/** Fixed floating contact button — present on every public page. */
export function WhatsAppButton() {
  return (
    <a
      href={whatsAppLink("Hi Kudmayi, I'd like to know more.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Kudmayi on WhatsApp"
      className="bg-brass-deep text-parchment fixed right-5 bottom-5 z-40 flex h-13 w-13 items-center justify-center rounded-full shadow-[0_4px_16px_rgba(23,20,16,0.25)] transition-transform hover:scale-105 sm:right-8 sm:bottom-8"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.1c-.24.68-1.4 1.31-1.93 1.36-.52.05-.99.24-3.33-.7-2.82-1.13-4.61-4-4.75-4.19-.14-.19-1.14-1.51-1.14-2.88 0-1.37.72-2.05.98-2.33.26-.28.56-.35.75-.35s.38 0 .55.01c.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.34 1.45.29.15.46.13.63-.08.17-.21.72-.84.91-1.13.19-.29.38-.24.63-.14.26.1 1.65.78 1.93.92.29.14.48.21.55.33.07.12.07.68-.17 1.36Z" />
      </svg>
    </a>
  );
}
