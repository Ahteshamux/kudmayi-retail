# Handoff — finishing the KUDMAYI Retail setup

Everything in this document is **remaining work**. The app itself is built and compiles; what's left is connecting it to a live Supabase project and confirming the data flows work end to end.

Project root: `/Users/ahteshamshabbir507/Desktop/Kudmayi 0.2`

---

## What KUDMAYI Retail is

Internal catalog manager for Kudmayi, a premium groom sherwani menswear brand. One non-technical person signs in, adds garments (photo, name, colour, category), and marks each available or not. Four fixed categories: Sherwani, Waistcoat, Prince Coat, Suit.

Not a storefront — no pricing, sizes, stock counts, orders, or checkout. Don't add them.

Stack: Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 · Supabase (Postgres + Storage + Auth) · deploy target Vercel.

---

## State as of this handoff

**Verified working:**
- `npm run build` — compiles clean, zero TypeScript errors, 5 routes
- `npm run lint` — passes, no warnings
- Auth gate — confirmed by curl: `/` and `/product/new` return `307 → /login` when signed out; `/login` returns `200`

**Not yet verified** — all of it blocked on Supabase credentials:
- Sign in
- Creating, editing, deleting a product
- Photo upload, compression, and storage cleanup
- Category counts on the home screen

**Known state of `.env.local`:**
- `NEXT_PUBLIC_SUPABASE_URL` — set to a real project URL ✅
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — **empty, this is the immediate blocker** ❌

A backup exists at `.env.local.bak`. It contains an earlier version with duplicate keys and placeholder values. Delete it once setup is confirmed working.

**Unknown** — the user reported these as done, but they were never confirmed, and `npm run verify` will tell you definitively:
- Whether `supabase/setup.sql` was actually run
- Whether the login user exists and is confirmed
- Whether signups were disabled

---

## The verification tool

`npm run verify` is the source of truth for setup state. Run it after every change below.

```bash
npm run verify                                    # checks config, connection, table, RLS, bucket
npm run verify -- ahteshamshabbir01@gmail.com PASSWORD   # also tests signing in
```

Each failed check prints the specific dashboard fix. Source: `scripts/verify-setup.mjs`.

---

## Remaining steps

### 1. Paste the anon key — blocking everything else

In `.env.local`, line 7 currently reads `NEXT_PUBLIC_SUPABASE_ANON_KEY=` with nothing after it.

The user gets the value from **Supabase → Project Settings → API**, the key labeled **`anon` `public`**. Format is either `eyJhbGci...` (JWT) or `sb_publishable_...` (newer projects) — both valid.

**Do not** accept the `service_role` key. It bypasses Row Level Security and must never reach a browser bundle. `verify` rejects it, but catch it earlier if you see it.

**Do not** paste the key into chat, a commit, or any file other than `.env.local`.

Then:
```bash
npm run verify
```

### 2. Run the database setup, if verify says the table is missing

If verify reports `✗ products table exists`, the SQL never ran.

The user opens **Supabase → SQL Editor → New query**, pastes the entire contents of `supabase/setup.sql`, and clicks Run. Expected result: "Success. No rows returned."

That script is idempotent — safe to run again if there's any doubt.

It creates the `products` table, an index on `(category, created_at desc)`, Row Level Security policies restricting all access to authenticated users, and the public-read `product-images` storage bucket.

Re-run `npm run verify` — you want `✓ products table exists`, `✓ Row Level Security is on`, and `✓ product-images bucket exists`.

### 3. Create the login, if sign-in fails

**Supabase → Authentication → Users → Add user → Create new user**
- Email: `ahteshamshabbir01@gmail.com`
- Password: the user's choice
- **Tick "Auto Confirm User"** — this is the single most common setup failure. Without it, sign-in fails and Supabase's own error text doesn't say why.

Confirm with:
```bash
npm run verify -- ahteshamshabbir01@gmail.com THEPASSWORD
```

> The user initially proposed using their email address as the password. They were advised against it — this login is the only thing protecting the catalog once it's on a public Vercel URL. If they still chose it, that's their call; don't re-litigate it, but it's worth one mention if the topic comes up naturally.

### 4. Disable signups

**Supabase → Authentication → Sign In / Providers → Email → turn "Enable signups" off.**

This app is single-user by design and exposes no signup UI, but the endpoint stays open until this is switched off. Not optional.

### 5. Walk the full flow in the browser

Start the app (`npm run dev`, http://localhost:3000) and confirm each of these. **Nothing below has ever been run against real data** — treat every step as genuinely unverified, and report what actually happens rather than assuming it works.

1. Sign in → lands on home, four category cards, all counts zero
2. **Add a piece** → upload a photo, name, colour, category, leave Available on → save
3. Redirects to the product detail page, photo visible, details correct
4. Category page shows the card — photo, name, sage "Available" badge, and the colour rendered as a **fabric swatch tag** in the lower-left corner of the image
5. Home count for that category incremented to 1
6. **Edit** → change the name, save → detail page reflects it
7. Toggle Available off → badge turns rust, card image dims and desaturates
8. Move the product to a different category → both the old and new category grids update correctly
9. Replace the photo → confirm in **Supabase → Storage → product-images** that the old file was deleted, not orphaned
10. **Delete** → confirmation dialog appears → redirects to the category page, row gone, and the storage file is gone too
11. Visit `/category/not-a-real-thing` → expect a 404
12. **Test on a real phone**, not just a narrow browser window — the network URL is printed by `npm run dev`. The photo-compression path (1600px long edge, JPEG q0.82, ~6MB → ~300KB) is the piece most worth checking on actual hardware, since it decides whether adding stock feels fast or painful.

### 6. Clean up

```bash
rm .env.local.bak
```

### 7. Deploy to Vercel, when the user is ready

1. Push to GitHub. `.gitignore` already excludes `.env*` while keeping `.env.local.example` — **verify no secrets are staged before the first commit.**
2. vercel.com → Add New → Project → import the repo
3. Add both env vars — `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — under Environment Variables
4. Deploy, then sign in on the live URL to confirm

`next.config.ts` derives the image `remotePatterns` hostname from `NEXT_PUBLIC_SUPABASE_URL` at build time. If that variable is missing in Vercel, photos will fail to render with an "un-allowlisted host" error — check it first if images break in production but work locally.

---

## Architecture notes worth knowing before editing

**Auth is enforced in exactly one place** — `proxy.ts` (Next 16 renamed the `middleware` convention to `proxy`; the codemod was already run). It redirects any session-less request to `/login`, so pages don't re-check. It calls `getUser()`, which revalidates the token with Supabase — do not swap it for `getSession()`, which trusts whatever the cookie claims.

**Writes go through Server Actions** in `app/product/actions.ts`, which re-validate every field server-side. A Server Action is a public endpoint; it can't trust the form that called it. Keep that validation if you touch the form.

**Photos take a split path** because compression needs a browser canvas. `components/ImageUpload.tsx` compresses and uploads directly to Supabase Storage client-side, then hands the resulting public URL to the form, which submits it to the server action. Storage cleanup on delete/replace is best-effort and deliberately non-fatal — a stale file shouldn't fail the database write.

**The four categories are fixed** in `lib/categories.ts` *and* in a `CHECK` constraint in `supabase/setup.sql`. Changing them means changing both; the database rejects anything else.

**Design tokens** live in the `@theme` block of `app/globals.css` — espresso `#171410`, brass `#B8905A`, parchment `#F3ECDF`, sage `#7C8F6B`, rust `#A85D4D`. Fraunces for display, Inter for functional text. Forms are intentionally plain; the visual personality sits on the home screen and the product cards. `components/SwatchTag.tsx` is the signature detail — don't flatten it into a coloured dot.

---

## Out of scope

Pricing, sizes, stock quantity, customer-facing storefront, orders, checkout. Search and sorting were also deliberately deferred until there's enough real stock to know what she actually reaches for.
