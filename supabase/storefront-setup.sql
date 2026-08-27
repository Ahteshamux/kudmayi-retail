-- KUDMAYI storefront catalog — one-time Supabase setup.
-- Paste this whole file into the Supabase SQL Editor and hit Run.
-- Safe to run more than once.
--
-- This is separate from supabase/setup.sql (the internal catalog tool's
-- `products` table) — different tables, different bucket, same project.
-- The public site reads these tables directly; the internal catalog tool
-- at /admin/catalog is untouched by this file.

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------

create table if not exists public.storefront_products (
  id                uuid        primary key default gen_random_uuid(),
  slug              text        not null unique,
  name              text        not null,
  category          text        not null check (
    category in ('sherwanis', 'prince-coats', 'waistcoats', 'kurtas', 'suits')
  ),
  price_rupees      integer     not null check (price_rupees >= 0),
  sale_price_rupees integer,
  ready_to_ship     boolean     not null default false,
  color_name        text        not null,
  color_hex         text        not null,
  description       text,
  sizes             text[]      not null default '{}',
  tags              text[]      not null default '{}',
  featured          boolean     not null default false,
  published         boolean     not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Additive — safe to re-run against a database created before sale
-- pricing / tags existed.
alter table public.storefront_products add column if not exists sale_price_rupees integer;
alter table public.storefront_products add column if not exists tags text[] not null default '{}';
alter table public.storefront_products drop constraint if exists storefront_products_sale_price_check;
alter table public.storefront_products add constraint storefront_products_sale_price_check
  check (sale_price_rupees is null or sale_price_rupees >= 0);

-- The listing page's only query shape: filter by category, newest first.
create index if not exists storefront_products_category_idx
  on public.storefront_products (category, created_at desc);

-- ---------------------------------------------------------------------------
-- Product images — one product can have several, ordered; the lowest
-- sort_order is the cover image shown on cards and as the gallery's first
-- frame. No separate is_cover flag to keep in sync.
-- ---------------------------------------------------------------------------

create table if not exists public.storefront_product_images (
  id          uuid        primary key default gen_random_uuid(),
  product_id  uuid        not null references public.storefront_products(id) on delete cascade,
  storage_path text       not null,
  public_url  text        not null,
  alt_text    text        not null default '',
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists storefront_product_images_product_idx
  on public.storefront_product_images (product_id, sort_order);

-- ---------------------------------------------------------------------------
-- Row level security
--
-- Unlike the internal catalog tool, this catalog is public: anyone (no
-- session) can read it — that's the storefront. Writes stay locked to
-- signed-in users, same login as /admin/catalog.
-- ---------------------------------------------------------------------------

alter table public.storefront_products enable row level security;
alter table public.storefront_product_images enable row level security;

drop policy if exists "public can read storefront products"        on public.storefront_products;
drop policy if exists "authenticated can insert storefront products" on public.storefront_products;
drop policy if exists "authenticated can update storefront products" on public.storefront_products;
drop policy if exists "authenticated can delete storefront products" on public.storefront_products;

create policy "public can read storefront products"
  on public.storefront_products for select using (true);

create policy "authenticated can insert storefront products"
  on public.storefront_products for insert to authenticated with check (true);

create policy "authenticated can update storefront products"
  on public.storefront_products for update to authenticated using (true) with check (true);

create policy "authenticated can delete storefront products"
  on public.storefront_products for delete to authenticated using (true);

drop policy if exists "public can read storefront product images"        on public.storefront_product_images;
drop policy if exists "authenticated can insert storefront product images" on public.storefront_product_images;
drop policy if exists "authenticated can update storefront product images" on public.storefront_product_images;
drop policy if exists "authenticated can delete storefront product images" on public.storefront_product_images;

create policy "public can read storefront product images"
  on public.storefront_product_images for select using (true);

create policy "authenticated can insert storefront product images"
  on public.storefront_product_images for insert to authenticated with check (true);

create policy "authenticated can update storefront product images"
  on public.storefront_product_images for update to authenticated using (true) with check (true);

create policy "authenticated can delete storefront product images"
  on public.storefront_product_images for delete to authenticated using (true);

-- ---------------------------------------------------------------------------
-- Storage bucket for storefront product photos — separate from the
-- internal catalog's `product-images` bucket.
--
-- Public read so <img>/next/image work without signed URLs; writes stay
-- locked to signed-in users.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('storefront-products', 'storefront-products', true)
on conflict (id) do update set public = true;

drop policy if exists "public can read storefront images"        on storage.objects;
drop policy if exists "authenticated can upload storefront images" on storage.objects;
drop policy if exists "authenticated can update storefront images" on storage.objects;
drop policy if exists "authenticated can delete storefront images" on storage.objects;

create policy "public can read storefront images"
  on storage.objects for select
  using (bucket_id = 'storefront-products');

create policy "authenticated can upload storefront images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'storefront-products');

create policy "authenticated can update storefront images"
  on storage.objects for update to authenticated
  using (bucket_id = 'storefront-products')
  with check (bucket_id = 'storefront-products');

create policy "authenticated can delete storefront images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'storefront-products');

-- ---------------------------------------------------------------------------
-- Homepage image slots — hero, category tiles, editorial sections,
-- collections strip, etc. See lib/website/homepage-slots.ts for the slot
-- list; a slot with no row here just shows its built-in fallback photo, so
-- this table only ever needs rows for slots someone has actually changed.
-- Photos are stored in the same storefront-products bucket, under a
-- homepage/ prefix.
-- ---------------------------------------------------------------------------

create table if not exists public.homepage_images (
  id         uuid        primary key default gen_random_uuid(),
  slot_key   text        not null unique,
  image_url  text        not null,
  -- Optional art-direction crops, for the few sections whose aspect ratio
  -- changes between breakpoints. Null means "use image_url".
  image_url_tablet text,
  image_url_mobile text,
  alt_text   text        not null default '',
  updated_at timestamptz not null default now()
);

alter table public.homepage_images enable row level security;

drop policy if exists "public can read homepage images"        on public.homepage_images;
drop policy if exists "authenticated can insert homepage images" on public.homepage_images;
drop policy if exists "authenticated can update homepage images" on public.homepage_images;
drop policy if exists "authenticated can delete homepage images" on public.homepage_images;

create policy "public can read homepage images"
  on public.homepage_images for select using (true);

create policy "authenticated can insert homepage images"
  on public.homepage_images for insert to authenticated with check (true);

create policy "authenticated can update homepage images"
  on public.homepage_images for update to authenticated using (true) with check (true);

create policy "authenticated can delete homepage images"
  on public.homepage_images for delete to authenticated using (true);

-- Additive — safe to re-run against a database created before per-breakpoint
-- homepage crops existed.
alter table public.homepage_images add column if not exists image_url_tablet text;
alter table public.homepage_images add column if not exists image_url_mobile text;

