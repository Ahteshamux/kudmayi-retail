import Link from "next/link";
import { signOut } from "@/app/admin/catalog/auth-actions";

const SECTIONS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Homepage", href: "/admin/homepage" },
  { label: "Retail", href: "/admin/catalog" },
];

/**
 * Shared chrome for every admin area, so you can move between them without
 * going back to the dashboard first.
 *
 * Reuses the same sign-out action as the Retail tool — it's one Supabase
 * session across all of /admin, not a login per section.
 */
export function AdminHeader({ current }: { current?: string }) {
  return (
    <header className="border-line border-b">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/admin" className="group shrink-0">
          <span className="font-display text-brass-deep text-lg tracking-[0.28em] uppercase">
            Kudmayi
          </span>
          <span className="text-muted u-caps mt-1 block">Admin</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-5">
          {SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              aria-current={section.href === current ? "page" : undefined}
              className={`u-caps transition-colors ${
                section.href === current
                  ? "text-espresso border-brass-deep border-b-2 pb-1"
                  : "text-muted hover:text-espresso"
              }`}
            >
              {section.label}
            </Link>
          ))}
          <form action={signOut}>
            <button
              type="submit"
              className="u-caps text-muted hover:text-espresso cursor-pointer p-2 transition-colors"
            >
              Sign out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
