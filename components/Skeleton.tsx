/**
 * Placeholder block used by the route-level loading screens. Matching the
 * real layout's shape means the page doesn't jump when content arrives.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`bg-well animate-pulse rounded-[2px] ${className}`}
    />
  );
}
