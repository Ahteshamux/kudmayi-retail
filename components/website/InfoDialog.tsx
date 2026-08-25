"use client";

import { useEffect, useId, useState } from "react";

/**
 * Generic trigger + modal, reused wherever the site needs a small piece of
 * reference info without a dedicated route — Size Guide, Shipping &
 * Returns, FAQs. Each instance owns its own open state, so multiple
 * triggers for the same content (e.g. Size Guide in both the product page
 * and the footer) don't need to share anything.
 */
export function InfoDialog({
  trigger,
  triggerClassName = "",
  title,
  children,
}: {
  trigger: React.ReactNode;
  triggerClassName?: string;
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={triggerClassName}>
        {trigger}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby={titleId}>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute inset-0 bg-espresso/40"
          />
          <div className="bg-parchment relative max-h-[85vh] w-full max-w-lg overflow-y-auto p-6 shadow-[0_8px_32px_rgba(23,20,16,0.2)] sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 id={titleId} className="font-display text-2xl">
                {title}
              </h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="u-caps shrink-0">
                Close
              </button>
            </div>
            <div className="text-muted mt-5 space-y-4 text-sm leading-relaxed">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
