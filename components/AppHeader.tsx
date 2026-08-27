import Link from "next/link";
import { signOut } from "@/app/admin/catalog/auth-actions";

/**
 * The Retail tool's own header. Kept separate from AdminHeader because
 * this tool has its own visual identity and a wider container, but it
 * links back to the dashboard so Retail isn't a dead end.
 */
export function AppHeader() {
  return (
    <header className="border-line border-b">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/admin/catalog" className="group shrink-0">
          <span className="font-display text-brass-deep text-lg tracking-[0.28em] uppercase">
            Kudmayi
          </span>
          <span className="text-muted u-caps mt-1 block">Retail</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-5">
          <Link
            href="/admin"
            className="u-caps text-muted hover:text-espresso transition-colors"
          >
            &larr; All Admin
          </Link>
          <Link
            href="/admin/products"
            className="u-caps text-muted hover:text-espresso transition-colors"
          >
            Products
          </Link>
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
