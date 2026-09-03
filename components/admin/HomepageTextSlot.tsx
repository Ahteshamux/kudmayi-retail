"use client";

import { useState, useTransition } from "react";
import { saveHomepageText } from "@/app/admin/homepage/actions";

/**
 * One editable homepage heading. Saves on blur, same "no separate publish
 * step" behaviour as HomepageImageSlot — with only a handful of these,
 * a per-field Save button would just be an extra click for no benefit.
 */
export function HomepageTextSlot({
  slotKey,
  label,
  value,
}: {
  slotKey: string;
  label: string;
  value: string;
}) {
  const [text, setText] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function persist() {
    const trimmed = text.trim();
    if (trimmed === value.trim()) return; // nothing changed, don't save/flash

    startTransition(async () => {
      const result = await saveHomepageText(slotKey, trimmed);
      if (result.error) {
        setError(result.error);
      } else {
        setError(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  }

  return (
    <div className="border-line bg-surface border p-4">
      <label className="u-caps text-muted block text-xs" htmlFor={`text-${slotKey}`}>
        {label}
      </label>
      <input
        id={`text-${slotKey}`}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={persist}
        className="border-line bg-parchment mt-2 w-full border px-3 py-2 text-sm"
      />
      <div className="mt-2 h-4 text-xs">
        {isPending && <span className="text-muted">Saving…</span>}
        {!isPending && saved && <span className="text-sage">Saved.</span>}
        {!isPending && error && <span className="text-rust">{error}</span>}
      </div>
    </div>
  );
}
