/**
 * Native <details>/<summary> — free expand/collapse, keyboard support, and
 * screen-reader semantics with zero client JS. The +/− swap is pure CSS
 * (details[open] flips it), no state needed.
 */
export function AccordionItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="border-line group border-t py-5 last:border-b">
      <summary className="u-caps flex cursor-pointer list-none items-center justify-between">
        {title}
        <span className="relative h-3 w-3 shrink-0">
          <span className="bg-espresso absolute top-1/2 left-0 h-px w-3 -translate-y-1/2" />
          <span className="bg-espresso absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 transition-opacity group-open:opacity-0" />
        </span>
      </summary>
      <div className="text-muted mt-4 max-w-prose text-sm leading-relaxed">{children}</div>
    </details>
  );
}
