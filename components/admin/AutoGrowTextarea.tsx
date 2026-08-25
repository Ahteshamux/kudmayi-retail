"use client";

import { useEffect, useRef } from "react";

/**
 * A textarea that grows to fit its content instead of scrolling or
 * truncating. Admin alt-text fields sit in narrow grid columns, where a
 * single-line <input> hides everything past the first few words — you
 * can't read back what you typed without arrowing through it.
 *
 * Height is driven off scrollHeight on every value change (and on mount,
 * for server-rendered values), so it settles at the right size without a
 * fixed row count.
 */
export function AutoGrowTextarea({
  value,
  onChange,
  onBlur,
  placeholder,
  className = "",
  minRows = 2,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  minRows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Collapse first, or scrollHeight only ever ratchets upward.
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={minRows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`u-field resize-none overflow-hidden ${className}`}
    />
  );
}
