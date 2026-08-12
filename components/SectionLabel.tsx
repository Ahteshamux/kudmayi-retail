/** Tailoring-label header: letter-spaced caps over a thin brass rule. */
export function SectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="u-caps text-muted">{children}</p>
      <div className="bg-brass/30 mt-2.5 h-px w-full" />
    </div>
  );
}
