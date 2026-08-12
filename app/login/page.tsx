"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/** Whether .env.local still holds the template values rather than real ones. */
function isUnconfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return !url || !key || url.includes("placeholder") || url.includes("yourproject");
}

/**
 * Supabase surfaces raw network and API errors. Translate the ones she can
 * actually act on; a bare "Failed to fetch" tells her nothing.
 */
function readableError(message: string): string {
  if (message === "Invalid login credentials") {
    return "That email and password don't match. Try again.";
  }
  if (message === "Failed to fetch" || message.includes("NetworkError")) {
    return "Can't reach the server. Check your internet connection and try again.";
  }
  if (message.includes("Email not confirmed")) {
    return "This account hasn't been confirmed yet. Confirm it in Supabase under Authentication → Users.";
  }
  if (message.includes("rate limit") || message.includes("Too many")) {
    return "Too many attempts. Wait a minute, then try again.";
  }
  return message;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    // Catch the setup mistake before it becomes a confusing network error.
    if (isUnconfigured()) {
      setError(
        "This app isn't connected to Supabase yet. Add your project URL and anon key to .env.local — see SETUP.md.",
      );
      return;
    }

    setPending(true);

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setError(readableError(error.message));
        setPending(false);
        return;
      }
    } catch (err) {
      setError(readableError(err instanceof Error ? err.message : String(err)));
      setPending(false);
      return;
    }

    // refresh() so the server re-renders with the new session cookie.
    router.replace("/");
    router.refresh();
  }

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center">
          <h1 className="font-display text-brass text-2xl tracking-[0.3em] uppercase">
            Kudmayi
          </h1>
          <p className="text-muted u-caps mt-3">Retail</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="u-caps text-muted block">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="u-field"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="u-caps text-muted block">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="u-field"
            />
          </div>

          {error && (
            <p role="alert" className="text-rust text-sm">
              {error}
            </p>
          )}

          <button type="submit" disabled={pending} className="u-btn u-caps w-full">
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
