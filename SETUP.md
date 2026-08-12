# Setting up KUDMAYI Retail

You only do this once. Budget about fifteen minutes.

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up.
2. **New project** — name it `kudmayi-retail`, pick a strong database password (save it in your password manager), and choose the region closest to you.
3. Wait for it to finish provisioning, roughly two minutes.

## 2. Create the table and the photo bucket

1. In the left sidebar, open **SQL Editor** → **New query**.
2. Open [`supabase/setup.sql`](supabase/setup.sql) from this project, copy the whole file, paste it into the editor.
3. Hit **Run**. You should see "Success. No rows returned."

That created the `products` table, locked it down so only signed-in users can touch it, and made the `product-images` storage bucket.

## 3. Copy your keys into the app

1. In Supabase, go to **Project Settings** → **API**.
2. Copy the **Project URL** and the **anon public** key.
3. In this project, duplicate `.env.local.example` and name the copy `.env.local`.
4. Paste the two values in:

```
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

The anon key is designed to be public — it's safe in a browser. Never copy the **service_role** key into this app.

## 4. Create the one login

The app has no signup screen on purpose. The single account is made by hand.

1. Go to **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter the email and a password.
3. Tick **Auto Confirm User**, then create.

Then close the door behind you: **Authentication** → **Sign In / Providers** → under Email, turn **Enable signups** off. Now nobody can create a second account.

## 5. Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you'll be sent to the login page. Sign in with the account from step 4.

## 6. Put it online (Vercel)

1. Push this project to GitHub.
2. At [vercel.com](https://vercel.com), **Add New** → **Project**, and import that repository.
3. Under **Environment Variables**, add the same two values from step 3 — `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. **Deploy**.

Vercel gives you a URL. That's the link to open on a phone — bookmark it or add it to the home screen.

## If something goes wrong

**"Invalid login credentials"** — the email or password is wrong, or the user in step 4 wasn't confirmed. Check **Authentication → Users**; the account should not say "Waiting for verification."

**Photos upload but don't appear** — the bucket isn't public. Re-run `setup.sql`, or check **Storage → product-images → Configuration** and confirm it's a public bucket.

**Everything loads but the catalog is empty after adding items** — you're likely signed out. The table is readable only to signed-in users by design.

**Changed the Supabase project?** Update `.env.local` locally *and* the environment variables in Vercel, then redeploy.
