# KUDMAYI Retail

Internal catalog manager for Kudmayi. One person signs in, adds garments with a photo, name and colour, and marks each one available or not. It is not a storefront — no pricing, sizes, stock counts or checkout.

**First time here? Read [SETUP.md](SETUP.md).** It walks through creating the Supabase project, the login, and the deploy.

## Running it

```bash
npm install
cp .env.local.example .env.local   # then fill in the two Supabase values
npm run dev
```

## The four collections

Sherwani · Waistcoat · Prince Coat · Suit

They're fixed. Adding a fifth means editing [`lib/categories.ts`](lib/categories.ts) **and** the `CHECK` constraint in [`supabase/setup.sql`](supabase/setup.sql) — the database rejects anything else.

## Screens

| Route | What it does |
|---|---|
| `/login` | Email + password. The only page reachable signed out. |
| `/` | The four collections with a count on each. |
| `/category/[slug]` | Grid of that collection. |
| `/product/new` | Add a piece. `?category=suit` preselects. |
| `/product/[id]` | Full detail. `?edit=1` switches to the edit form. |

## How it's put together

```
app/
  page.tsx                 home — collections and counts
  login/page.tsx           the only client-rendered auth screen
  category/[slug]/         product grid
  product/new/             add form
  product/[id]/            detail, and edit when ?edit=1
  product/actions.ts       create / update / delete (Server Actions)
  auth-actions.ts          sign out
components/                SwatchTag, ProductCard, ProductForm, ImageUpload…
lib/
  categories.ts            the four collections, single source of truth
  image.ts                 client-side photo compression
  supabase/{client,server,session}.ts
proxy.ts                   auth gate on every request
supabase/setup.sql         run once in the Supabase SQL editor
```

**Auth** is enforced in one place — [`proxy.ts`](proxy.ts) redirects anything without a session to `/login`, so pages don't each re-check. It calls `getUser()`, which revalidates the token with Supabase rather than trusting the cookie.

**Writes** go through Server Actions in [`app/product/actions.ts`](app/product/actions.ts). They re-validate every field server-side; a Server Action is a public endpoint and can't trust the form that called it.

**Photos** take a split path, because compression needs a browser canvas. [`ImageUpload`](components/ImageUpload.tsx) shrinks the file to 1600px on its long edge, uploads it straight to Supabase Storage, and passes the resulting public URL to the form. That turns a 6 MB phone photo into roughly 300 KB, which matters when adding stock over mobile data. Deleting a product removes its stored file too, so the bucket doesn't fill with orphans.

**Access** is locked at the database, not just the UI. Row Level Security means the `products` table is readable only by signed-in users, so the anon key on its own reveals nothing.

## Design

Deep espresso ground (`#171410`), brass accent (`#B8905A`), parchment text (`#F3ECDF`), sage for available, rust for unavailable. Fraunces for headings, Inter for everything functional. Tokens live in the `@theme` block of [`app/globals.css`](app/globals.css).

The signature detail is [`SwatchTag`](components/SwatchTag.tsx) — the colour shown as a small fabric label stitched into the corner of each card, rather than a coloured dot. Forms stay deliberately plain; the personality sits on the home screen and the cards.

## Not built, on purpose

Pricing, sizes, stock quantity, a customer-facing storefront, orders. Search and sorting were also left out — worth adding once there's enough real stock to know what she actually reaches for.
