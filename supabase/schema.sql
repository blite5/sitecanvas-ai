-- Paletto published_sites table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor

create table if not exists public.published_sites (
  id          text        primary key,
  name        text        not null,
  elements    jsonb       not null default '[]'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  version     integer     not null default 1
);

-- Index for fast lookups
create index if not exists idx_published_sites_updated on public.published_sites (updated_at desc);

-- ── Row Level Security ────────────────────────────────────────────────────────
-- WARNING: This is an open MVP policy. Anyone can read, insert, or update.
-- Before going to production, add user_id column and restrict to owners.

alter table public.published_sites enable row level security;

create policy "Public can read published sites"
  on public.published_sites
  for select
  using (true);

create policy "Anyone can insert published sites"
  on public.published_sites
  for insert
  with check (true);

create policy "Anyone can update published sites"
  on public.published_sites
  for update
  using (true)
  with check (true);
