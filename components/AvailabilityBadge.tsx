export function AvailabilityBadge({
  available,
  size = "sm",
}: {
  available: boolean;
  size?: "sm" | "md";
}) {
  const tone = available
    ? "text-sage border-sage/40 bg-sage/10"
    : "text-rust border-rust/40 bg-rust/10";

  return (
    <span
      className={`u-caps inline-flex items-center gap-1.5 rounded-[2px] border ${tone} ${
        size === "md" ? "px-2.5 py-1.5" : "px-2 py-1"
      }`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${available ? "bg-sage" : "bg-rust"}`}
      />
      {available ? "Available" : "Unavailable"}
    </span>
  );
}
