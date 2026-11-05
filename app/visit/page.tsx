import type { Metadata, Viewport } from "next";
import {
  GOOGLE_MAPS_URL,
  GOOGLE_REVIEW_URL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  SITE_URL,
  STORE_ADDRESS,
  TIKTOK_URL,
} from "@/lib/website/constants";
import { whatsAppLink } from "@/lib/website/whatsapp";

/**
 * /visit — the page behind the QR card in the store. Someone is standing in
 * the shop, phone in one hand, so:
 * - One screen, no header/footer/nav: nothing to choose between but these
 *   links (Hick's law), laid out like every link-in-bio page they already
 *   know (Jakob's law).
 * - Full-width rows, 64px tall, in the lower, thumb-reachable part of the
 *   screen (Fitts's law).
 * - The ask that matters most in the moment, a Google review, is the only
 *   filled button (Von Restorff); the rest are quiet rows.
 *
 * Outside the (website) route group on purpose, so it doesn't inherit the
 * storefront chrome. Revalidates hourly rather than being fully static —
 * the CDN would otherwise hold it for a year (see app/(website)/layout.tsx).
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: "Visit Kudmayi" },
  description: "Leave a review, follow Kudmayi, or message us on WhatsApp.",
  alternates: { canonical: `${SITE_URL}/visit` },
  // An in-store card page, not something to rank.
  robots: { index: false, follow: true },
};

export const viewport: Viewport = { themeColor: "#3b2a1d" };

type LinkItem = {
  label: string;
  hint: string;
  href: string;
  icon: React.ReactNode;
  primary?: boolean;
};

export default function VisitPage() {
  const links: LinkItem[] = [
    {
      label: "Leave a Google review",
      hint: "Takes 30 seconds and helps us a lot",
      href: GOOGLE_REVIEW_URL ?? GOOGLE_MAPS_URL,
      icon: <StarIcon />,
      primary: true,
    },
    {
      label: "Message us on WhatsApp",
      hint: "Sizes, prices, fittings",
      href: whatsAppLink("Hi Kudmayi, I just visited your store."),
      icon: <WhatsAppIcon />,
    },
    {
      label: "Follow on Instagram",
      hint: `@${INSTAGRAM_HANDLE}`,
      href: INSTAGRAM_URL,
      icon: <InstagramIcon />,
    },
    ...(TIKTOK_URL
      ? [{ label: "Follow on TikTok", hint: "@kudmayi.official", href: TIKTOK_URL, icon: <TikTokIcon /> }]
      : []),
    {
      label: "Shop online",
      hint: "kudmayi.pk",
      href: "/",
      icon: <GlobeIcon />,
    },
  ];

  return (
    <main className="bg-parchment text-espresso flex min-h-dvh flex-col px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col">
        <header className="text-center">
          <p className="font-display text-3xl tracking-[0.3em]">KUDMAYI</p>
          <p className="u-caps text-muted mt-2">Crafted for the Occasion</p>
          <h1 className="font-display mt-8 text-2xl leading-snug">
            Thank you for visiting us.
          </h1>
          <p className="text-muted mt-2 text-sm">
            If you liked what you saw, a quick review means the world to a small atelier.
          </p>
        </header>

        {/* mt-auto pushes the buttons down into easy thumb reach on tall
            phones, while short phones still scroll naturally. */}
        <nav aria-label="Kudmayi links" className="mt-auto pt-10">
          <ul className="space-y-3">
            {links.map((link) => {
              const external = !link.href.startsWith("/");
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={`flex min-h-16 items-center gap-4 border px-4 py-3 transition-colors active:scale-[0.99] ${
                      link.primary
                        ? "bg-bark text-parchment border-bark hover:bg-espresso"
                        : "bg-surface border-line hover:border-brass-deep"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`flex h-10 w-10 shrink-0 items-center justify-center ${
                        link.primary ? "text-parchment" : "text-brass-deep"
                      }`}
                    >
                      {link.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{link.label}</span>
                      <span
                        className={`block truncate text-sm ${link.primary ? "text-parchment/75" : "text-muted"}`}
                      >
                        {link.hint}
                      </span>
                    </span>
                    <span aria-hidden className={link.primary ? "text-parchment/75" : "text-muted"}>
                      &rarr;
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <footer className="text-muted mt-8 text-center text-xs leading-relaxed">
          <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            {STORE_ADDRESS}
          </a>
        </footer>
      </div>
    </main>
  );
}

const iconProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function StarIcon() {
  return (
    <svg {...iconProps}>
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg {...iconProps}>
      <path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3 3z" />
      <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 1a5 5 0 0 1-3-3l1-1-1-2z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg {...iconProps}>
      <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 3c.5 2.8 2.3 4.5 5 4.8" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
    </svg>
  );
}
