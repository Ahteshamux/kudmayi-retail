import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/session";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Everything except Next internals and static assets — those don't need a
     * session check and skipping them keeps navigation quick.
     *
     * manifest.webmanifest must stay public: the browser fetches it without
     * credentials when adding the app to a phone home screen, and a redirect
     * there breaks the install silently.
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
