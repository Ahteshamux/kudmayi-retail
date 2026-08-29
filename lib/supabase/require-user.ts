import { createClient } from "./server";

/**
 * Authorization guard for Server Actions.
 *
 * The proxy.ts matcher (`/admin/:path*`) gates *page navigations*, but it
 * is NOT sufficient on its own for Server Actions. A Server Action is
 * dispatched by its action ID in the `Next-Action` header, and that POST
 * can be aimed at any route in the app — including public storefront
 * routes the matcher never runs on. Action IDs are deterministic build
 * artifacts and are discoverable in the client bundle, so an unauthorized
 * caller can invoke an admin mutation by POSTing to `/` with the right
 * header and never pass through the middleware at all.
 *
 * Next.js is explicit that Server Actions must be treated as public HTTP
 * endpoints: every one that mutates data re-checks the session here.
 *
 * Uses getUser(), which revalidates the token against Supabase — never
 * getSession(), which trusts whatever the cookie claims.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Message returned to callers that aren't signed in. */
export const UNAUTHORIZED_MESSAGE = "You need to be signed in to do that.";

/**
 * For actions that return an ActionState-shaped result: yields an error
 * object when there's no session, or null when the caller is authorized.
 */
export async function unauthorizedState(): Promise<{ error: string } | null> {
  const user = await getCurrentUser();
  return user ? null : { error: UNAUTHORIZED_MESSAGE };
}

/**
 * For actions with no error channel (they return void). Throws rather
 * than failing silently, so an unauthorized call can never be mistaken
 * for a successful no-op.
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error(UNAUTHORIZED_MESSAGE);
  return user;
}
