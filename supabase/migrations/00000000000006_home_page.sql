-- Home page content. One singleton table per one-of-a-kind section block;
-- Timeline/Certificates/Specialties sections here only hold the section
-- heading copy -- their actual items come from the shared tables in the
-- previous migration.

create table public.home_hero (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(eyebrow)),
  heading_prefix jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading_prefix)),
  heading_highlight jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading_highlight)),
  paragraph jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(paragraph)),
  cta_primary_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(cta_primary_label)),
  cta_secondary_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(cta_secondary_label)),
  phone_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(phone_label)),
  social_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(social_label)),
  background_media_id uuid references public.media (id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.home_about (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(eyebrow)),
  heading_prefix jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading_prefix)),
  heading_highlight jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading_highlight)),
  paragraph_1 jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(paragraph_1)),
  paragraph_2 jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(paragraph_2)),
  doctor_name jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(doctor_name)),
  doctor_title jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(doctor_title)),
  cta_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(cta_label)),
  doctor_image_media_id uuid references public.media (id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.home_video_intro (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(eyebrow)),
  heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading)),
  description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(description)),
  duration text not null default '',
  thumbnail_media_id uuid references public.media (id) on delete set null,
  video_url text,
  updated_at timestamptz not null default now()
);

create table public.home_stats_section (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(eyebrow)),
  heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading)),
  updated_at timestamptz not null default now()
);

create table public.home_stats (
  id uuid primary key default gen_random_uuid(),
  label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(label)),
  value int not null default 0,
  suffix text not null default '',
  icon text not null default 'users',
  sort_order int not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.home_timeline_section (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(eyebrow)),
  heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading)),
  updated_at timestamptz not null default now()
);

create table public.home_certificates_section (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(eyebrow)),
  heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading)),
  updated_at timestamptz not null default now()
);

create table public.home_specialties_section (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(eyebrow)),
  heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading)),
  view_all_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(view_all_label)),
  updated_at timestamptz not null default now()
);

create table public.home_doctor_message (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(eyebrow)),
  heading_prefix jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading_prefix)),
  heading_highlight jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading_highlight)),
  quote jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(quote)),
  signature_name jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(signature_name)),
  signature_title jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(signature_title)),
  portrait_image_media_id uuid references public.media (id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into public.home_hero (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;
insert into public.home_about (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;
insert into public.home_video_intro (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;
insert into public.home_stats_section (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;
insert into public.home_timeline_section (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;
insert into public.home_certificates_section (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;
insert into public.home_specialties_section (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;
insert into public.home_doctor_message (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;

do $$
declare
  t text;
  singletons text[] := array[
    'home_hero', 'home_about', 'home_video_intro', 'home_stats_section',
    'home_timeline_section', 'home_certificates_section',
    'home_specialties_section', 'home_doctor_message'
  ];
begin
  foreach t in array singletons loop
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at();', t);
    execute format('alter table public.%I enable row level security;', t);
    execute format('create policy %I on public.%I for select to anon, authenticated using (true);', t || '_public_read', t);
    execute format('create policy %I on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin());', t || '_admin_update', t);
  end loop;
end $$;

create trigger set_updated_at before update on public.home_stats
  for each row execute function public.set_updated_at();

do $$
begin
  execute 'alter table public.home_stats enable row level security;';
  execute 'create policy home_stats_public_read on public.home_stats for select to anon, authenticated using (status = ''published'');';
  execute 'create policy home_stats_admin_read on public.home_stats for select to authenticated using (public.is_admin());';
  execute 'create policy home_stats_admin_insert on public.home_stats for insert to authenticated with check (public.is_admin());';
  execute 'create policy home_stats_admin_update on public.home_stats for update to authenticated using (public.is_admin()) with check (public.is_admin());';
  execute 'create policy home_stats_admin_delete on public.home_stats for delete to authenticated using (public.is_admin());';
end $$;
