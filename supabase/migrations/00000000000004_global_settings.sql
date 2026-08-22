-- Sitewide settings shared across every page. `site_settings` is the single
-- source of truth for phone/WhatsApp/email/address, replacing both
-- src/lib/contact.ts's hardcoded constants and the previously-divergent
-- footer.phone value.
--
-- Singleton tables throughout this schema (this file and later ones) use a
-- fixed, well-known row id and are only ever UPDATEd by the app, never
-- INSERTed into again -- that's what keeps them a true singleton without
-- needing extra application-level "find or create" logic.

create table public.site_settings (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  site_name jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(site_name)),
  tagline jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(tagline)),
  logo_media_id uuid references public.media (id) on delete set null,
  favicon_media_id uuid references public.media (id) on delete set null,
  default_hero_bg_media_id uuid references public.media (id) on delete set null,
  phone text not null default '',
  whatsapp_number text not null default '',
  email text not null default '',
  address jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(address)),
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values ('00000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

create trigger set_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

create policy "site_settings_public_read" on public.site_settings
  for select to anon, authenticated using (true);

create policy "site_settings_admin_update" on public.site_settings
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());


-- Social platform links. Every icon on the live site currently links to
-- href="#" -- this table is what finally gives them real destinations.
create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,          -- e.g. "facebook", "instagram", "tiktok", "youtube", "whatsapp"
  url text not null default '',
  icon text not null,              -- key into the frontend's icon registry
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.social_links
  for each row execute function public.set_updated_at();

alter table public.social_links enable row level security;

create policy "social_links_public_read" on public.social_links
  for select to anon, authenticated using (is_active = true);

create policy "social_links_admin_read" on public.social_links
  for select to authenticated using (public.is_admin());

create policy "social_links_admin_insert" on public.social_links
  for insert to authenticated with check (public.is_admin());

create policy "social_links_admin_update" on public.social_links
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "social_links_admin_delete" on public.social_links
  for delete to authenticated using (public.is_admin());


-- Header nav + footer "Quick Links" both read from this one table, so a
-- relabel or reorder only ever needs to happen in one place.
create table public.nav_items (
  id uuid primary key default gen_random_uuid(),
  label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(label)),
  href text not null,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.nav_items
  for each row execute function public.set_updated_at();

alter table public.nav_items enable row level security;

create policy "nav_items_public_read" on public.nav_items
  for select to anon, authenticated using (is_active = true);

create policy "nav_items_admin_read" on public.nav_items
  for select to authenticated using (public.is_admin());

create policy "nav_items_admin_insert" on public.nav_items
  for insert to authenticated with check (public.is_admin());

create policy "nav_items_admin_update" on public.nav_items
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "nav_items_admin_delete" on public.nav_items
  for delete to authenticated using (public.is_admin());


-- One row per public page (+ one "default" fallback row) for SEO metadata.
create table public.page_seo (
  id uuid primary key default gen_random_uuid(),
  page_key text not null unique,  -- 'default' | 'home' | 'about' | 'services' | 'videos' | 'patient-stories' | 'articles' | 'contact'
  seo_title jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(seo_title)),
  meta_description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(meta_description)),
  og_image_media_id uuid references public.media (id) on delete set null,
  canonical_url text,
  robots text not null default 'index,follow',
  updated_at timestamptz not null default now()
);

insert into public.page_seo (page_key) values
  ('default'), ('home'), ('about'), ('services'), ('videos'),
  ('patient-stories'), ('articles'), ('contact')
on conflict (page_key) do nothing;

create trigger set_updated_at before update on public.page_seo
  for each row execute function public.set_updated_at();

alter table public.page_seo enable row level security;

create policy "page_seo_public_read" on public.page_seo
  for select to anon, authenticated using (true);

create policy "page_seo_admin_insert" on public.page_seo
  for insert to authenticated with check (public.is_admin());

create policy "page_seo_admin_update" on public.page_seo
  for update to authenticated using (public.is_admin()) with check (public.is_admin());


-- Sitewide default WhatsApp/Call banner. Services page overrides title/
-- subtitle only (the one confirmed override case in the current codebase);
-- that override lives on services_page_content, added in a later migration.
create table public.final_cta_content (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  title jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(title)),
  subtitle jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(subtitle)),
  whatsapp_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(whatsapp_label)),
  call_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(call_label)),
  updated_at timestamptz not null default now()
);

insert into public.final_cta_content (id) values ('00000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

create trigger set_updated_at before update on public.final_cta_content
  for each row execute function public.set_updated_at();

alter table public.final_cta_content enable row level security;

create policy "final_cta_content_public_read" on public.final_cta_content
  for select to anon, authenticated using (true);

create policy "final_cta_content_admin_update" on public.final_cta_content
  for update to authenticated using (public.is_admin()) with check (public.is_admin());


-- Contact form submissions. Visitors can create; only admins can read/
-- manage the inbox -- this is the one table where "public write, no public
-- read" is the correct shape, opposite of every content table above.
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

create policy "contact_submissions_public_insert" on public.contact_submissions
  for insert to anon, authenticated with check (true);

create policy "contact_submissions_admin_read" on public.contact_submissions
  for select to authenticated using (public.is_admin());

create policy "contact_submissions_admin_update" on public.contact_submissions
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "contact_submissions_admin_delete" on public.contact_submissions
  for delete to authenticated using (public.is_admin());
