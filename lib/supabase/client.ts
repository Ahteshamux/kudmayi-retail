import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for the browser. Used by the login form and by the image
 * uploader, which has to run client-side because compression needs a canvas.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
