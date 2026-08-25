# KUDMAYI

A luxury Pakistani menswear and weddingwear storefront — sherwanis, prince coats, waistcoats, kurtas, and suits — plus two admin tools behind it.

**First time here? Read [SETUP.md](SETUP.md).** It walks through creating the Supabase project and the login shared by both admin tools.

## Running it

```bash
npm install
cp .env.local.example .env.local   # fill in the Supabase values; DATABASE_URL is optional at first
npm run dev
```

Without `DATABASE_URL`, the public site still runs fully — it falls back to a built-in placeholder catalog (40 products across the five categories) so the design is never blocked on database setup. See [Connecting the real catalog](#connecting-the-real-catalog) below to make `/admin/products` actually save anything.

## What's here

Three things share this codebase:

1. **The public storefront** (`/`, `/shop/[category]`, `/product/[slug]`, `/custom-kurta`) — unauthenticated, what customers see.
2. **`/admin/products`** — the real product catalog manager: name, category, price, colour, sizes, description, and photo gallery (upload, reorder, delete). Backed by Postgres via Supabase + Drizzle ORM; this is what the storefront reads from once connected.
3. **`/admin/catalog`** — a separate, older internal tool with its own four-category list (Sherwani/Waistcoat/Prince Coat/Suit), no pricing. Predates the storefront, kept as-is, unrelated data.

Both admin tools sit behind the same login (`/admin/catalog/login` — there's only one sign-in screen for all of `/admin`), enforced in one place: [`proxy.ts`](proxy.ts).

## Connecting the real catalog

The storefront ships with a placeholder catalog so the design works out of the box. To make `/admin/products` real:

1. **Supabase → SQL Editor**, run [`supabase/storefront-setup.sql`](supabase/storefront-setup.sql) — creates the tables, storage bucket, and access policies. (This is separate from [`supabase/setup.sql`](supabase/setup.sql), which is for the older `/admin/catalog` tool only.)
2. **Supabase → Project Settings → Database → Connection string** (Transaction pooler mode), add it to `.env.local` as `DATABASE_URL`. Never paste it anywhere else, including chat.
3. Restart the dev server. Optionally run `npm run seed-storefront` to load the 40 placeholder products as real, editable rows — otherwise start from an empty catalog via `/admin/products/new`.

Once `DATABASE_URL` is set, every public product page and listing reads live from the database; if it's ever unreachable, the site quietly falls back to the placeholder catalog rather than breaking.

## Routes

| Route | What it does |
|---|---|
| `/` | Homepage — hero, category grid, featured collection, editorial sections. |
| `/shop/[category]` | Product listing: sherwanis, prince-coats, waistcoats, kurtas, suits. |
| `/product/[slug]` | Product detail — gallery, price, description, sizes, colour. |
| `/custom-kurta` | Custom-order enquiry (routes to WhatsApp for now). |
| `/admin/products` | Product list. `/new` to add, `/[slug]` to edit. |
| `/admin/catalog` | The older internal tool — four fixed categories, no pricing. |
| `/admin/catalog/login` | The only sign-in screen, for both admin tools. |

## How it's put together

```
app/
  (website)/               the public site — homepage, shop, product, custom-kurta
  admin/
    products/               the real catalog admin (Postgres + Drizzle)
    catalog/                the older internal tool (Supabase client directly)
  admin/catalog/login/      the shared sign-in screen
components/
  website/                  public-site components (header, sections, cards)
  admin/                    shared admin components (image uploader, forms)
lib/
  db/                       Drizzle schema + client (lib/db/client.ts falls back
                             to null if DATABASE_URL isn't set — see its doc comment)
  website/                  categories, product queries, placeholder catalog,
                             design-system helpers (pricing format, etc.)
  categories.ts, supabase/  the older catalog tool's own files, untouched
supabase/
  setup.sql                 /admin/catalog's tables + storage bucket
  storefront-setup.sql      the real catalog's tables + storage bucket
drizzle/                    generated migration SQL (reference only — the
                             tables are provisioned by hand via storefront-setup.sql,
                             see the comment at the top of lib/db/schema.ts)
scripts/
  seed-storefront-products.ts   loads the placeholder catalog into the real DB
```

**Auth** is enforced in one place — [`proxy.ts`](proxy.ts) redirects anything under `/admin` without a session to `/admin/catalog/login`, so pages don't each re-check. It calls `getUser()`, which revalidates the token with Supabase rather than trusting the cookie.

**Writes** to `/admin/products` go through Server Actions in [`app/admin/products/actions.ts`](app/admin/products/actions.ts); writes to `/admin/catalog` go through [`app/admin/catalog/product/actions.ts`](app/admin/catalog/product/actions.ts). Both re-validate every field server-side — a Server Action is a public endpoint and can't trust the form that called it.

**Photos** take a split path in both admin tools, because compression needs a browser canvas: the uploader components shrink the file client-side and upload it straight to Supabase Storage, then hand the resulting public URL to the form. `/admin/products` supports multiple photos per product with reordering (the first is the cover image) and per-image alt text; `/admin/catalog` is single-photo only.

**Access** is locked at the database, not just the UI, for both admin tables — Row Level Security means writes require a signed-in session. The storefront catalog's reads are intentionally public (no session needed), since that's what powers the public site; the internal catalog's reads stay authenticated-only.

## Design

Deep espresso ink (`#171410`), brass accent (`#B8905A`), warm parchment ground (`#F3ECDF`), a rich dark-brown announcement bar (`#3B2A1D`), sage for available, rust for unavailable. Fraunces for display type, Inter for everything functional. Tokens live in the `@theme` block of [`app/globals.css`](app/globals.css).

## Not built yet, on purpose

Cart, checkout, orders, appointments, wishlist persistence, and search are all still ahead — the storefront and its admin exist now, but buying isn't wired up yet. `/admin/catalog`'s own scope (pricing, storefront features) was deliberately never expanded; it's a separate, smaller tool.
