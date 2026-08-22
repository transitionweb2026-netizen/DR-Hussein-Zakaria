-- Patient Stories + Reviews. `reviews.avatar_media_id` replaces the current
-- avatar-${i%4+1}.png positional formula, which silently drops avatar-5.png
-- and never gives an individual reviewer their own real image.
--
-- Privacy note (per the user's explicit requirement): only a display name
-- and non-sensitive narrative fields are collected -- no date of birth,
-- national ID, medical record number, or similar is modeled anywhere here.

create table public.patient_stories_page_content (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  hero_eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_eyebrow)),
  hero_heading_prefix jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_heading_prefix)),
  hero_heading_highlight jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_heading_highlight)),
  hero_paragraph jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_paragraph)),
  intro_eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(intro_eyebrow)),
  intro_heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(intro_heading)),
  reviews_intro_eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(reviews_intro_eyebrow)),
  reviews_intro_heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(reviews_intro_heading)),
  read_story_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(read_story_label)),
  label_condition jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(label_condition)),
  label_journey jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(label_journey)),
  label_outcome jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(label_outcome)),
  updated_at timestamptz not null default now()
);

insert into public.patient_stories_page_content (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;

create trigger set_updated_at before update on public.patient_stories_page_content
  for each row execute function public.set_updated_at();

alter table public.patient_stories_page_content enable row level security;

create policy "patient_stories_page_content_public_read" on public.patient_stories_page_content
  for select to anon, authenticated using (true);

create policy "patient_stories_page_content_admin_update" on public.patient_stories_page_content
  for update to authenticated using (public.is_admin()) with check (public.is_admin());


create table public.patient_stories (
  id uuid primary key default gen_random_uuid(),
  name jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(name)),
  title jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(title)),
  condition jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(condition)),
  journey jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(journey)),
  outcome jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(outcome)),
  image_media_id uuid references public.media (id) on delete set null,
  sort_order int not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  name jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(name)),
  role jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(role)),
  quote jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(quote)),
  rating smallint not null default 5 check (rating between 1 and 5),
  avatar_media_id uuid references public.media (id) on delete set null,
  review_date date,
  source text,
  sort_order int not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.patient_stories
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.reviews
  for each row execute function public.set_updated_at();

do $$
declare
  t text;
  tables text[] := array['patient_stories', 'reviews'];
begin
  foreach t in array tables loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('create policy %I on public.%I for select to anon, authenticated using (status = ''published'');', t || '_public_read', t);
    execute format('create policy %I on public.%I for select to authenticated using (public.is_admin());', t || '_admin_read', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.is_admin());', t || '_admin_insert', t);
    execute format('create policy %I on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin());', t || '_admin_update', t);
    execute format('create policy %I on public.%I for delete to authenticated using (public.is_admin());', t || '_admin_delete', t);
  end loop;
end $$;
