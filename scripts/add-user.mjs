/**
 * Creates a login for KUDMAYI Retail.
 *
 *   SUPABASE_SERVICE_ROLE_KEY=xxx npm run add-user -- someone@email.com 'their-password'
 *
 * The service_role key bypasses Row Level Security, so it is read from the
 * environment only — never from a file, never committed, never hardcoded.
 * Get it from Supabase → Project Settings → API → service_role (click Reveal).
 *
 * Users created here are auto-confirmed, so they can sign in immediately.
 */

import { readFile } from "node:fs/promises";

const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";

const [email, password] = process.argv.slice(2);

function die(message, hint) {
  console.error(`\n${RED}${message}${RESET}`);
  if (hint) console.error(`${YELLOW}${hint}${RESET}`);
  console.error("");
  process.exit(1);
}

if (!email || !password) {
  die(
    "Need an email and a password.",
    "Usage: SUPABASE_SERVICE_ROLE_KEY=xxx npm run add-user -- someone@email.com 'their-password'",
  );
}

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceKey) {
  die(
    "SUPABASE_SERVICE_ROLE_KEY is not set.",
    "Supabase → Project Settings → API → service_role → Reveal, then:\n" +
      "  SUPABASE_SERVICE_ROLE_KEY=xxx npm run add-user -- email password",
  );
}

// Read the project URL from .env.local so there's one place it's configured.
let url;
try {
  const raw = await readFile(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const eq = trimmed.indexOf("=");
    if (trimmed.slice(0, eq).trim() === "NEXT_PUBLIC_SUPABASE_URL") {
      url = trimmed.slice(eq + 1).trim();
    }
  }
} catch {
  die(".env.local not found.", "Copy .env.local.example to .env.local first — see SETUP.md.");
}

if (!url || url.includes("placeholder") || url.includes("yourproject")) {
  die(
    "NEXT_PUBLIC_SUPABASE_URL isn't set to a real project.",
    "Fill it in in .env.local — see SETUP.md.",
  );
}

// A weak password here is a weak password for the whole catalog.
if (password.length < 8) {
  die("Password must be at least 8 characters.");
}
if (password.trim().toLowerCase() === email.trim().toLowerCase()) {
  console.warn(
    `${YELLOW}Warning: this password is identical to the email address.${RESET}`,
  );
  console.warn(
    `${DIM}Anyone who knows the email knows the password, and every user has full delete access.${RESET}\n`,
  );
}

const res = await fetch(`${url}/auth/v1/admin/users`, {
  method: "POST",
  headers: {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: email.trim(),
    password,
    email_confirm: true, // skip the confirmation email; they can sign in now
  }),
});

const body = await res.json().catch(() => ({}));

if (res.ok) {
  console.log(`\n${GREEN}✓ Created ${email}${RESET}`);
  console.log(`${DIM}  They can sign in straight away.${RESET}\n`);
  process.exit(0);
}

const message = body.msg || body.message || body.error_description || `status ${res.status}`;

if (res.status === 422 || /already/i.test(message)) {
  die(
    `${email} already exists.`,
    "Change their password in Supabase → Authentication → Users instead.",
  );
}

if (res.status === 401 || res.status === 403) {
  die(
    "That key was rejected.",
    "Make sure you used the service_role key, not the anon key.",
  );
}

die(`Couldn't create the user: ${message}`);
