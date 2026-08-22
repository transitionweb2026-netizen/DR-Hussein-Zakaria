-- Videos page. `video_url`/`video_provider` are genuinely new -- every
-- "video" on the current site is a static thumbnail with a non-functional
-- decorative Play button; there is no real video playback anywhere today.

create table public.videos_page_content (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  hero_eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_eyebrow)),
  hero_heading_prefix jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_heading_prefix)),
  hero_heading_highlight jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_heading_highlight)),
  hero_paragraph jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_paragraph)),
  intro_eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(intro_eyebrow)),
  intro_heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(intro_heading)),
  intro_description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(intro_description)),
  updated_at timestamptz not null default now()
);

insert into public.videos_page_content (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;

create trigger set_updated_at before update on public.videos_page_content
  for each row execute function public.set_updated_at();

alter table public.videos_page_content enable row level security;

create policy "videos_page_content_public_read" on public.videos_page_content
  for select to anon, authenticated using (true);

create policy "videos_page_content_admin_update" on public.videos_page_content
  for update to authenticated using (public.is_admin()) with check (public.is_admin());


create table public.videos (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(title)),
  description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(description)),
  duration text not null default '',
  thumbnail_media_id uuid references public.media (id) on delete set null,
  video_url text,
  video_provider text check (video_provider is null or video_provider in ('youtube', 'vimeo', 'mp4')),
  sort_order int not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.videos
  for each row execute function public.set_updated_at();

do $$
begin
  execute 'alter table public.videos enable row level security;';
  execute 'create policy videos_public_read on public.videos for select to anon, authenticated using (status = ''published'');';
  execute 'create policy videos_admin_read on public.videos for select to authenticated using (public.is_admin());';
  execute 'create policy videos_admin_insert on public.videos for insert to authenticated with check (public.is_admin());';
  execute 'create policy videos_admin_update on public.videos for update to authenticated using (public.is_admin()) with check (public.is_admin());';
  execute 'create policy videos_admin_delete on public.videos for delete to authenticated using (public.is_admin());';
end $$;
