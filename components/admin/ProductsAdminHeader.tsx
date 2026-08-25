import Link from "next/link";
import { signOut } from "@/app/admin/catalog/auth-actions";

/**
 * Reuses the same sign-out action as the internal catalog tool — it's the
 * same Supabase Auth session either way, just a different section of the
 * admin. Deliberately not sharing AppHeader itself, since that component's
 * brand link points at /admin/catalog specifically.
 */
export function ProductsAdminHeader() {
  return (
    <header className="border-line border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/admin/products" className="group">
          <span className="font-display text-brass-deep text-lg tracking-[0.28em] uppercase">
            Kudmayi
          </span>
          <span className="text-muted u-caps mt-1 block">Products</span>
        </Link>

        <nav className="flex items-center gap-5">
          <Link
            href="/admin/products"
            className="u-caps text-muted hover:text-espresso transition-colors"
          >
            Products
          </Link>
          <Link
            href="/admin/homepage"
            className="u-caps text-muted hover:text-espresso transition-colors"
          >
            Homepage
          </Link>
          <Link
            href="/admin/catalog"
            className="u-caps text-muted hover:text-espresso transition-colors"
          >
            Retail Admin
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
