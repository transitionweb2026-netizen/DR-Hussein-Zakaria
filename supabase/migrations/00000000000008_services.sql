-- Services page. service_categories already exists (shared table, previous
-- migration). `surgeries` replaces the current JSON-object-keyed-by-category
-- shape with a real category_id foreign key, and adds several fields that
-- don't exist anywhere in the current data model: full_description
-- (distinct from the short card-summary), symptoms, treatment_info, faq,
-- and video_url.

create table public.services_page_content (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  hero_eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_eyebrow)),
  hero_heading_prefix jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_heading_prefix)),
  hero_heading_highlight jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_heading_highlight)),
  hero_paragraph jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_paragraph)),
  intro_eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(intro_eyebrow)),
  intro_heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(intro_heading)),
  intro_paragraph jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(intro_paragraph)),
  detailed_heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(detailed_heading)),
  view_procedures_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(view_procedures_label)),
  cta_title jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(cta_title)),
  cta_subtitle jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(cta_subtitle)),
  updated_at timestamptz not null default now()
);

insert into public.services_page_content (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;

create trigger set_updated_at before update on public.services_page_content
  for each row execute function public.set_updated_at();

alter table public.services_page_content enable row level security;

create policy "services_page_content_public_read" on public.services_page_content
  for select to anon, authenticated using (true);

create policy "services_page_content_admin_update" on public.services_page_content
  for update to authenticated using (public.is_admin()) with check (public.is_admin());


create table public.surgeries (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.service_categories (id) on delete cascade,
  slug text not null unique,
  title jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(title)),
  short_description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(short_description)),
  full_description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(full_description)),
  symptoms jsonb check (symptoms is null or public.is_bilingual(symptoms)),
  treatment_info jsonb check (treatment_info is null or public.is_bilingual(treatment_info)),
  faq jsonb,                          -- nullable array of {question:{en,ar}, answer:{en,ar}}
  video_url text,
  primary_image_media_id uuid references public.media (id) on delete set null,
  sort_order int not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index surgeries_category_id_idx on public.surgeries (category_id);

-- Additional images beyond the primary card/hero image, for the detailed
-- surgery modal's gallery -- a genuinely new capability, not a rename of
-- an existing field.
create table public.surgery_images (
  id uuid primary key default gen_random_uuid(),
  surgery_id uuid not null references public.surgeries (id) on delete cascade,
  media_id uuid not null references public.media (id) on delete cascade,
  sort_order int not null default 0
);

create index surgery_images_surgery_id_idx on public.surgery_images (surgery_id);

create trigger set_updated_at before update on public.surgeries
  for each row execute function public.set_updated_at();

do $$
begin
  execute 'alter table public.surgeries enable row level security;';
  execute 'create policy surgeries_public_read on public.surgeries for select to anon, authenticated using (status = ''published'');';
  execute 'create policy surgeries_admin_read on public.surgeries for select to authenticated using (public.is_admin());';
  execute 'create policy surgeries_admin_insert on public.surgeries for insert to authenticated with check (public.is_admin());';
  execute 'create policy surgeries_admin_update on public.surgeries for update to authenticated using (public.is_admin()) with check (public.is_admin());';
  execute 'create policy surgeries_admin_delete on public.surgeries for delete to authenticated using (public.is_admin());';
end $$;

-- surgery_images has no status of its own -- it's a pure join table, and
-- exposing "these extra images exist" isn't a meaningful leak even for an
-- unpublished surgery (the media files themselves already sit in the
-- public bucket). Read is open; writes are admin-only.
alter table public.surgery_images enable row level security;

create policy "surgery_images_public_read" on public.surgery_images
  for select to anon, authenticated using (true);

create policy "surgery_images_admin_insert" on public.surgery_images
  for insert to authenticated with check (public.is_admin());

create policy "surgery_images_admin_update" on public.surgery_images
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "surgery_images_admin_delete" on public.surgery_images
  for delete to authenticated using (public.is_admin());
