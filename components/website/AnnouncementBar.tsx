import {
  GOOGLE_MAPS_URL,
  STORE_ADDRESS,
  STORE_ADDRESS_SHORT,
} from "@/lib/website/constants";

/**
 * Always-solid dark brown strip above the header proper — unlike the row(s)
 * below it, this never goes transparent over the hero; it's a fixed
 * presence at the very top of every page, same as the reference layout.
 *
 * Carries the store address with a Google Maps link. Below sm it shows the
 * short address and no "Visit our store", so it stays on one row on a
 * phone (the full line wraps to two at 375px).
 */
export function AnnouncementBar() {
  return (
    <div className="bg-bark text-parchment px-4 py-2 text-center">
      <p className="u-caps">
        <span className="hidden sm:inline">Visit our store · {STORE_ADDRESS}</span>
        <span className="sm:hidden">{STORE_ADDRESS_SHORT}</span>
        {" · "}
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          Get Directions
        </a>
      </p>
    </div>
  );
}
