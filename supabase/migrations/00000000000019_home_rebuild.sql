-- Home page rebuild: adds the genuinely new content types the new
-- 11-section Home structure introduces (Technologies, Why Choose reasons,
-- FAQ), plus lightweight section-heading singletons for sections that
-- reuse already-existing shared tables (Reviews, Featured Videos,
-- Articles) on Home, plus two additive description columns on existing
-- singletons the new spec explicitly requires. All additive -- no existing
-- table is altered destructively, no data is dropped.

-- ---------------------------------------------------------------------
-- Technologies
-- ---------------------------------------------------------------------

create table public.home_technologies_section (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(eyebrow)),
  heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading)),
  description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(description)),
  updated_at timestamptz not null default now()
);

create table public.technologies (
  id uuid primary key default gen_random_uuid(),
  name jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(name)),
  description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(description)),
  icon text not null default 'cpu',
  image_media_id uuid references public.media (id) on delete set null,
  sort_order int not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Why Dr. Hussein Zakaria? (adapted from the dormant why-choose.tsx)
-- ---------------------------------------------------------------------

create table public.home_why_choose_section (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(eyebrow)),
  heading_prefix jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading_prefix)),
  heading_highlight jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading_highlight)),
  description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(description)),
  image_media_id uuid references public.media (id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.why_choose_reasons (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(title)),
  description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(description)),
  icon text not null default 'cpu',
  sort_order int not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Lightweight section-heading singletons for sections that reuse
-- already-existing shared tables on Home (reviews, videos, articles) --
-- the real CRUD for the items themselves stays at their one existing
-- screen (/admin/reviews, /admin/videos, /admin/articles).
-- ---------------------------------------------------------------------

create table public.home_reviews_section (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(eyebrow)),
  heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading)),
  description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(description)),
  view_all_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(view_all_label)),
  updated_at timestamptz not null default now()
);

create table public.home_videos_section (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(eyebrow)),
  heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading)),
  description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(description)),
  view_all_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(view_all_label)),
  updated_at timestamptz not null default now()
);

create table public.home_articles_section (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(eyebrow)),
  heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading)),
  description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(description)),
  view_all_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(view_all_label)),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- FAQ (adapted from the dormant faq.tsx; genuinely new content, no
-- existing table) -- Home-scoped, paired with Articles in one section.
-- ---------------------------------------------------------------------

create table public.home_faq_section (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(eyebrow)),
  heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading)),
  description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(description)),
  updated_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(question)),
  answer jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(answer)),
  sort_order int not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Additive columns on existing singletons, explicitly required by the
-- new spec for section-level supporting text.
-- ---------------------------------------------------------------------

alter table public.home_stats_section
  add column description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(description));

alter table public.home_certificates_section
  add column description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(description));

-- ---------------------------------------------------------------------
-- Seed singleton rows + RLS, same pattern as every other migration.
-- ---------------------------------------------------------------------

insert into public.home_technologies_section (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;
insert into public.home_why_choose_section (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;
insert into public.home_reviews_section (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;
insert into public.home_videos_section (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;
insert into public.home_articles_section (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;
insert into public.home_faq_section (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;

do $$
declare
  t text;
  singletons text[] := array[
    'home_technologies_section', 'home_why_choose_section', 'home_reviews_section',
    'home_videos_section', 'home_articles_section', 'home_faq_section'
  ];
begin
  foreach t in array singletons loop
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at();', t);
    execute format('alter table public.%I enable row level security;', t);
    execute format('create policy %I on public.%I for select to anon, authenticated using (true);', t || '_public_read', t);
    execute format('create policy %I on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin());', t || '_admin_update', t);
  end loop;
end $$;

do $$
declare
  t text;
  tables text[] := array['technologies', 'why_choose_reasons', 'faqs'];
begin
  foreach t in array tables loop
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at();', t);
    execute format('alter table public.%I enable row level security;', t);
    execute format('create policy %I on public.%I for select to anon, authenticated using (status = ''published'');', t || '_public_read', t);
    execute format('create policy %I on public.%I for select to authenticated using (public.is_admin());', t || '_admin_read', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.is_admin());', t || '_admin_insert', t);
    execute format('create policy %I on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin());', t || '_admin_update', t);
    execute format('create policy %I on public.%I for delete to authenticated using (public.is_admin());', t || '_admin_delete', t);
  end loop;
end $$;
