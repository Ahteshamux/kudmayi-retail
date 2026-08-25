import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/** Whether DATABASE_URL still holds a template value rather than a real one. */
function isConfigured(url: string | undefined): url is string {
  return Boolean(url) && !url!.includes("USER:PASSWORD@HOST");
}

let cached: PostgresJsDatabase<typeof schema> | null | undefined;

/**
 * Lazily creates the Drizzle client, or returns null if DATABASE_URL isn't
 * set up yet. Every caller in lib/website/products.ts and the admin
 * Server Actions checks for null: public pages fall back to the static
 * placeholder catalog (the site keeps working on placeholder data until
 * the real database is connected, rather than 500ing the moment this file
 * is imported — same philosophy as the config-failure handling already in
 * app/health/route.ts), while admin writes surface a clear "not connected
 * yet" error instead of silently doing nothing.
 */
export function getDb() {
  if (cached !== undefined) return cached;

  const url = process.env.DATABASE_URL;
  if (!isConfigured(url)) {
    cached = null;
    return cached;
  }

  // Supabase's Postgres always requires SSL; `require` here means "use
  // SSL, don't bother verifying the CA chain" — fine for a managed
  // Supabase endpoint, same trust level the dashboard's own tools use.
  const client = postgres(url, { prepare: false, ssl: "require" });
  cached = drizzle(client, { schema });
  return cached;
}
