-- Extensions, shared helper functions, and shared types used by every later migration.

create extension if not exists pgcrypto;

-- Draft/published lifecycle used by every repeatable content table.
create type public.content_status as enum ('draft', 'published');

-- Bilingual text columns are stored as jsonb: {"en": "...", "ar": "..."}.
-- This check only requires both keys to be present -- not non-empty -- so an
-- admin can save a row with only one language finished.
create or replace function public.is_bilingual(val jsonb)
returns boolean
language sql
immutable
as $$
  select val ? 'en' and val ? 'ar';
$$;

-- Keeps updated_at current on every UPDATE. Attached per-table below.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
