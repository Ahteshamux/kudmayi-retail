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
      icon: <GoogleLogo />,
      primary: true,
    },
    {
      label: "Message us on WhatsApp",
      hint: "Sizes, prices, fittings",
      href: whatsAppLink("Hi Kudmayi, I just visited your store."),
      icon: <WhatsAppLogo />,
    },
    {
      label: "Follow on Instagram",
      hint: `@${INSTAGRAM_HANDLE}`,
      href: INSTAGRAM_URL,
      icon: <InstagramLogo />,
    },
    ...(TIKTOK_URL
      ? [{ label: "Follow on TikTok", hint: "@kudmayi.official", href: TIKTOK_URL, icon: <TikTokLogo /> }]
      : []),
    {
      label: "Shop online",
      hint: "kudmayi.pk",
      href: "/",
      icon: <GlobeLogo />,
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
                    <span aria-hidden className="shrink-0">
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

/*
 * Real brand marks, so each row is recognisable at a glance before it's
 * read. Paths: Simple Icons (CC0); the Google "G" is Google's standard
 * four-colour mark. Each sits on a white app-icon tile so it reads on both
 * the dark primary row and the light ones.
 */
function LogoTile({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
      {children}
    </span>
  );
}

function GoogleLogo() {
  return (
    <LogoTile>
      <svg width="22" height="22" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      </svg>
    </LogoTile>
  );
}

function WhatsAppLogo() {
  return (
    <LogoTile>
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    </LogoTile>
  );
}

function InstagramLogo() {
  return (
    <LogoTile>
      <svg width="22" height="22" viewBox="0 0 24 24">
        <defs>
          <linearGradient id="ig-gradient" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#FEDA75" />
            <stop offset="0.3" stopColor="#FA7E1E" />
            <stop offset="0.55" stopColor="#D62976" />
            <stop offset="0.8" stopColor="#962FBF" />
            <stop offset="1" stopColor="#4F5BD5" />
          </linearGradient>
        </defs>
        <path fill="url(#ig-gradient)" d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
      </svg>
    </LogoTile>
  );
}

function TikTokLogo() {
  return (
    <LogoTile>
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#000000" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    </LogoTile>
  );
}

function GlobeLogo() {
  return (
    <LogoTile>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8a6534" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
      </svg>
    </LogoTile>
  );
}
