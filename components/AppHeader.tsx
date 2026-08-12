import Link from "next/link";
import { signOut } from "@/app/auth-actions";

export function AppHeader() {
  return (
    <header className="border-brass/15 border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="group">
          <span className="font-display text-brass text-lg tracking-[0.28em] uppercase">
            Kudmayi
          </span>
          <span className="text-muted u-caps mt-1 block">Retail</span>
        </Link>

        <form action={signOut}>
          <button
            type="submit"
            className="u-caps text-muted hover:text-parchment cursor-pointer p-2 transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
