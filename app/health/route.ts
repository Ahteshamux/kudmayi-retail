import { NextResponse } from "next/server";

/**
 * Deployment diagnostic. Reports whether the Supabase configuration reached
 * this build and whether it actually works — without revealing the key.
 *
 * Public on purpose: it has to be readable when login is broken. It exposes
 * nothing sensitive (the project URL and publishable key are public by
 * design, and only a prefix of the key is shown). Safe to delete once the
 * deployment is settled.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  const report: Record<string, unknown> = {
    urlPresent: Boolean(url),
    urlValue: url || null,
    keyPresent: Boolean(key),
    keyLength: key.length,
    keyPrefix: key ? key.slice(0, 18) + "…" : null,
    keyLooksSecret: key.startsWith("sb_secret_") || key.includes("service_role"),
  };

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
    report.fetchError = err instanceof Error ? err.message : String(err);
    report.verdict =
      "This server cannot reach Supabase at all — wrong URL, or outbound network blocked.";
  }

  return NextResponse.json(report, { status: 200 });
}
