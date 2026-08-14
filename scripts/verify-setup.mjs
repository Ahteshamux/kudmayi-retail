/**
 * Checks that Supabase is wired up correctly. Run after following SETUP.md:
 *
 *   npm run verify
 *   npm run verify -- you@email.com yourpassword   (also tests signing in)
 *
 * Reads .env.local directly so it works without a running dev server.
 */

import { readFile } from "node:fs/promises";

const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";

let failed = false;

function pass(label, detail = "") {
  console.log(`  ${GREEN}✓${RESET} ${label}${detail ? ` ${DIM}${detail}${RESET}` : ""}`);
}

function fail(label, fix) {
  failed = true;
  console.log(`  ${RED}✗${RESET} ${label}`);
  if (fix) console.log(`    ${YELLOW}→ ${fix}${RESET}`);
}

async function loadEnv() {
  let raw;
  try {
    raw = await readFile(new URL("../.env.local", import.meta.url), "utf8");
  } catch {
    return null;
  }

  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    // Later entries win, matching how Next.js reads the file.
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

console.log("\nChecking your Supabase setup\n");

// --- 1. Environment ---------------------------------------------------------

const env = await loadEnv();

if (!env) {
  fail(".env.local exists", "Copy .env.local.example to .env.local, then fill it in.");
  console.log("");
  process.exit(1);
}
pass(".env.local exists");

const url = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!url || url.includes("placeholder") || url.includes("yourproject")) {
  fail(
    "Project URL is set",
    "Supabase → Project Settings → API → copy 'Project URL' into NEXT_PUBLIC_SUPABASE_URL.",
  );
} else {
  pass("Project URL is set", url);
}

if (!key || key.includes("placeholder")) {
  fail(
    "Anon key is set",
    "Supabase → Project Settings → API → copy the 'anon public' key into NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
} else if (key.startsWith("eyJ") && key.includes("service_role")) {
  fail(
    "Anon key is the *anon* key",
    "That looks like the service_role key. Use the 'anon public' one — the service key must never be in a browser app.",
  );
} else {
  pass("Anon key is set", `${key.slice(0, 12)}…`);
}

if (failed) {
  console.log(`\n${RED}Fix the above, then run this again.${RESET}\n`);
  process.exit(1);
}

// --- 2. Reachability and table ----------------------------------------------
//
// Both are judged from one real table query. Supabase's /rest/v1/ root returns
// 401 even for a perfectly good anon key, so pinging it proves nothing.

const headers = { apikey: key, Authorization: `Bearer ${key}` };

let tableRes;
try {
  tableRes = await fetch(`${url}/rest/v1/products?select=id&limit=1`, { headers });
} catch (err) {
  fail(
    "Project is reachable",
    `Couldn't connect (${err.message}). Check the URL is right and you're online.`,
  );
  console.log("");
  process.exit(1);
}

if (tableRes.status === 401) {
  fail(
    "Project is reachable",
    "The anon key was rejected. Re-copy it from Project Settings → API.",
  );
  console.log("");
  process.exit(1);
}

pass("Project is reachable");

// --- 3. Table ---------------------------------------------------------------

if (tableRes.status === 404) {
  fail(
    "products table exists",
    "Run supabase/setup.sql in the Supabase SQL Editor.",
  );
} else if (tableRes.ok) {
  // RLS blocks anon reads, so an empty array here is the *correct* result.
  const rows = await tableRes.json();
  if (Array.isArray(rows) && rows.length === 0) {
    pass("products table exists");
    pass("Row Level Security is on", "anon can't read the catalog — as intended");
  } else {
    pass("products table exists");
    fail(
      "Row Level Security is on",
      "Anon can read your catalog. Re-run supabase/setup.sql to restore the policies.",
    );
  }
} else {
  const body = await tableRes.text();
  fail("products table exists", `Server replied ${tableRes.status}: ${body.slice(0, 120)}`);
}

// --- 4. Storage bucket ------------------------------------------------------

const bucketRes = await fetch(
  `${url}/storage/v1/object/list/product-images`,
  {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ prefix: "", limit: 1 }),
  },
);

if (bucketRes.ok) {
  pass("product-images bucket exists");
} else if (bucketRes.status === 404) {
  fail(
    "product-images bucket exists",
    "Run supabase/setup.sql — it creates the bucket.",
  );
} else {
  fail(
    "product-images bucket exists",
    `Server replied ${bucketRes.status}. Check Storage in the dashboard.`,
  );
}

// --- 5. Optional sign-in ----------------------------------------------------

const [email, password] = process.argv.slice(2);

if (email && password) {
  const authRes = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (authRes.ok) {
    pass("Sign in works", email);
  } else {
    const body = await authRes.json().catch(() => ({}));
    const msg = body.error_description || body.msg || `status ${authRes.status}`;
    fail(
      "Sign in works",
      msg.includes("not confirmed")
        ? "The user isn't confirmed. Supabase → Authentication → Users → confirm it."
        : `${msg}. Create the user under Authentication → Users (tick Auto Confirm).`,
    );
  }
} else {
  console.log(
    `  ${DIM}· Sign in not tested — rerun with: npm run verify -- you@email.com yourpassword${RESET}`,
  );
}

// --- Done -------------------------------------------------------------------

if (failed) {
  console.log(`\n${RED}Some checks failed. Fix the arrows above, then run again.${RESET}\n`);
  process.exit(1);
}

console.log(`\n${GREEN}All good. Run npm run dev and sign in.${RESET}\n`);
