-- About Doctor page rebuild: two genuinely new content types. Career
-- Timeline / Certificates / Main Specialties / Doctor's Message all reuse
-- existing shared tables + existing (or about-page-specific) heading
-- singletons already in place from earlier migrations -- nothing to add
-- for those. Statistics reuses the existing shared home_stats table (the
-- same pattern already proven for career_timeline/certificates/
-- service_categories) with its own heading singleton here.

create table public.about_video_intro (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(eyebrow)),
  heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading)),
  description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(description)),
  duration text not null default '',
  thumbnail_media_id uuid references public.media (id) on delete set null,
  video_url text,
  video_provider text check (video_provider is null or video_provider in ('youtube', 'vimeo', 'mp4')),
  updated_at timestamptz not null default now()
);

create table public.about_stats_section (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(eyebrow)),
  heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(heading)),
  description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(description)),
  updated_at timestamptz not null default now()
);

insert into public.about_video_intro (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;
insert into public.about_stats_section (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;

do $$
declare
  t text;
  singletons text[] := array['about_video_intro', 'about_stats_section'];
begin
  foreach t in array singletons loop
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at();', t);
    execute format('alter table public.%I enable row level security;', t);
    execute format('create policy %I on public.%I for select to anon, authenticated using (true);', t || '_public_read', t);
    execute format('create policy %I on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin());', t || '_admin_update', t);
  end loop;
end $$;
