"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error: string | null };

/** Whether .env.local still holds template values rather than real ones. */
function isUnconfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return (
    !url || !key || url.includes("placeholder") || url.includes("yourproject")
  );
}

/**
 * Supabase surfaces raw network and API errors. Translate the ones she can
 * act on; a bare "Failed to fetch" tells her nothing.
 */
function readableError(message: string): string {
  if (message === "Invalid login credentials") {
    return "That email and password don't match. Try again.";
  }
  if (message === "Failed to fetch" || message.includes("fetch failed")) {
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

/**
 * Signing in server-side keeps @supabase/supabase-js out of the login
 * bundle — it's the first screen anyone loads, often on mobile data.
 */
export async function signIn(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (isUnconfigured()) {
    return {
      error:
        "This app isn't connected to Supabase yet. Add your project URL and anon key to .env.local — see SETUP.md.",
    };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: readableError(error.message) };
  } catch (err) {
    return {
      error: readableError(err instanceof Error ? err.message : String(err)),
    };
  }

  redirect("/");
}
