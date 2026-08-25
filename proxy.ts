import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/session";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // The auth gate only protects the admin/catalog tool now — the rest of
  // the site is the public storefront and needs no session check.
  matcher: ["/admin/:path*"],
};
