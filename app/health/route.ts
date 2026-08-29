import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/require-user";

/**
 * Deployment diagnostic. Reports whether the Supabase configuration reached
 * this build and whether it actually works — without revealing the key.
 *
 * Readable signed-out on purpose: it has to work when login is broken. But
 * signed-out callers get only booleans and a verdict — enough to diagnose a
 * bad deploy, without echoing the project URL and key prefix to anyone who
 * curls it. The identifying detail is there for a signed-in admin only.
 *
 * Safe to delete once the deployment is settled.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  const isAdmin = Boolean(await getCurrentUser());

  const report: Record<string, unknown> = {
    urlPresent: Boolean(url),
    keyPresent: Boolean(key),
    keyLooksSecret: key.startsWith("sb_secret_") || key.includes("service_role"),
  };

  if (isAdmin) {
    report.urlValue = url || null;
    report.keyLength = key.length;
    report.keyPrefix = key ? key.slice(0, 18) + "…" : null;
  }

  if (!url || !key) {
    report.verdict =
      "Supabase config did not reach this build. The variables were not set when `next build` ran.";
    return NextResponse.json(report, { status: 200 });
  }

  // Does the configured pair actually work from this server?
  try {
    const res = await fetch(`${url}/rest/v1/products?select=id&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    report.supabaseStatus = res.status;
    report.verdict =
      res.status === 200
        ? "Config is correct and Supabase is reachable. Login should work."
        : res.status === 401
          ? "The key is being rejected — wrong key, or it belongs to a different project."
          : `Unexpected response from Supabase: ${res.status}`;
  } catch (err) {
    report.supabaseStatus = null;
    if (isAdmin) {
      report.fetchError = err instanceof Error ? err.message : String(err);
    }
    report.verdict =
      "This server cannot reach Supabase at all — wrong URL, or outbound network blocked.";
  }

  return NextResponse.json(report, { status: 200 });
}
