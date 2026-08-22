-- New /about page. Career/Certificates/Specialties items are shared with
-- Home (see 00000000000005_shared_content.sql) -- this file only holds the
-- About page's own hero/biography/CTA copy, its section headings for the
-- shared blocks, and the one genuinely new repeatable content type
-- (education) that doesn't exist anywhere on the site today.

create table public.about_page_content (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  hero_eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_eyebrow)),
  hero_heading_prefix jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_heading_prefix)),
  hero_heading_highlight jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_heading_highlight)),
  hero_paragraph jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_paragraph)),
  biography jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(biography)),
  doctor_image_media_id uuid references public.media (id) on delete set null,
  education_heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(education_heading)),
  cta_title jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(cta_title)),
  cta_subtitle jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(cta_subtitle)),
  updated_at timestamptz not null default now()
);

create table public.about_education (
  id uuid primary key default gen_random_uuid(),
  degree jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(degree)),
  institution jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(institution)),
  year text not null default '',
  sort_order int not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.about_timeline_section (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(eyebrow)),
  heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading)),
  updated_at timestamptz not null default now()
);

create table public.about_certificates_section (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(eyebrow)),
  heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading)),
  updated_at timestamptz not null default now()
);

create table public.about_specialties_section (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(eyebrow)),
  heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading)),
  updated_at timestamptz not null default now()
);

insert into public.about_page_content (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;
insert into public.about_timeline_section (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;
insert into public.about_certificates_section (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;
insert into public.about_specialties_section (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;

do $$
declare
  t text;
  singletons text[] := array[
    'about_page_content', 'about_timeline_section',
    'about_certificates_section', 'about_specialties_section'
  ];
begin
  foreach t in array singletons loop
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at();', t);
    execute format('alter table public.%I enable row level security;', t);
    execute format('create policy %I on public.%I for select to anon, authenticated using (true);', t || '_public_read', t);
    execute format('create policy %I on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin());', t || '_admin_update', t);
  end loop;
end $$;

create trigger set_updated_at before update on public.about_education
  for each row execute function public.set_updated_at();

do $$
begin
  execute 'alter table public.about_education enable row level security;';
  execute 'create policy about_education_public_read on public.about_education for select to anon, authenticated using (status = ''published'');';
  execute 'create policy about_education_admin_read on public.about_education for select to authenticated using (public.is_admin());';
  execute 'create policy about_education_admin_insert on public.about_education for insert to authenticated with check (public.is_admin());';
  execute 'create policy about_education_admin_update on public.about_education for update to authenticated using (public.is_admin()) with check (public.is_admin());';
  execute 'create policy about_education_admin_delete on public.about_education for delete to authenticated using (public.is_admin());';
end $$;
