-- Media Library. `media` is the queryable Postgres metadata; the actual
-- bytes live in the Storage bucket created below. Every image/video FK
-- elsewhere in the schema points at media.id.

create table public.media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'media',
  path text not null unique,            -- storage object path, e.g. "home/doctor-portrait-<uuid>.jpg"
  folder text not null,                 -- logical grouping shown in the Media Library UI, e.g. "home"
  filename text not null,               -- original uploaded filename, for display
  mime_type text not null,
  size_bytes bigint not null default 0,
  width int,
  height int,
  alt_text jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(alt_text)),
  uploaded_by uuid references public.admin_users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.media enable row level security;

-- Metadata isn't sensitive (the files themselves sit in a public bucket
-- anyway) so anyone can read the catalog; only admins can add/edit/remove.
create policy "media_public_read" on public.media
  for select to anon, authenticated
  using (true);

create policy "media_admin_insert" on public.media
  for insert to authenticated
  with check (public.is_admin());

create policy "media_admin_update" on public.media
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "media_admin_delete" on public.media
  for delete to authenticated
  using (public.is_admin());

-- Storage bucket: one public bucket, folder-prefixed (see media.folder
-- above for the logical grouping used by the admin UI). Public read matches
-- how every image on the site renders today (no auth gate); writes are
-- admin-only.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_bucket_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');

create policy "media_bucket_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

create policy "media_bucket_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

create policy "media_bucket_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());
