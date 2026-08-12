-- KUDMAYI Retail — one-time Supabase setup.
-- Paste this whole file into the Supabase SQL Editor and hit Run.
-- Safe to run more than once.

-- ---------------------------------------------------------------------------
-- Products table
-- ---------------------------------------------------------------------------

create table if not exists public.products (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  category   text        not null check (category in ('sherwani', 'waistcoat', 'prince-coat', 'suit')),
  color      text        not null,
  image_url  text,
  available  boolean     not null default true,
  created_at timestamptz not null default now()
);

-- The category page's only query shape: filter by category, newest first.
create index if not exists products_category_idx
  on public.products (category, created_at desc);

-- ---------------------------------------------------------------------------
-- Row level security
--
-- Only signed-in users can read or write. The anon key on its own gets
-- nothing, so the catalog is not exposed even if that key leaks.
-- ---------------------------------------------------------------------------

alter table public.products enable row level security;

drop policy if exists "authenticated can read products"   on public.products;
drop policy if exists "authenticated can insert products" on public.products;
drop policy if exists "authenticated can update products" on public.products;
drop policy if exists "authenticated can delete products" on public.products;

create policy "authenticated can read products"
  on public.products for select to authenticated using (true);

create policy "authenticated can insert products"
  on public.products for insert to authenticated with check (true);

create policy "authenticated can update products"
  on public.products for update to authenticated using (true) with check (true);

create policy "authenticated can delete products"
  on public.products for delete to authenticated using (true);

-- ---------------------------------------------------------------------------
-- Storage bucket for product photos
--
-- Public read so <img> tags work without signed URLs; writes stay locked to
-- signed-in users.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "public can read product images"        on storage.objects;
drop policy if exists "authenticated can upload product images" on storage.objects;
drop policy if exists "authenticated can update product images" on storage.objects;
drop policy if exists "authenticated can delete product images" on storage.objects;

create policy "public can read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "authenticated can upload product images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images');

create policy "authenticated can update product images"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

create policy "authenticated can delete product images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images');
