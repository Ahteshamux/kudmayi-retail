import type { Config } from "drizzle-kit";

/**
 * drizzle-kit config — used for `drizzle-kit generate` (schema.ts →
 * migration SQL) and, once DATABASE_URL is set, `drizzle-kit studio` to
 * browse the live tables. The tables themselves are provisioned by hand
 * via supabase/storefront-setup.sql, not by `drizzle-kit push`/`migrate`
 * — see the comment at the top of lib/db/schema.ts for why.
 */
export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://USER:PASSWORD@HOST:5432/postgres",
  },
} satisfies Config;
