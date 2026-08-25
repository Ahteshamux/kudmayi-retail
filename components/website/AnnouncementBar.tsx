import Link from "next/link";

/**
 * Always-solid dark brown strip above the header proper — unlike the row(s)
 * below it, this never goes transparent over the hero; it's a fixed
 * presence at the very top of every page, same as the reference layout.
 */
export function AnnouncementBar() {
  return (
    <div className="bg-bark text-parchment px-4 py-2 text-center">
      <p className="u-caps">
        The Groom Edit Is Here{" "}
        <Link href="#groom-edit" className="underline underline-offset-2">
          Shop Now
        </Link>
      </p>
    </div>
  );
}
