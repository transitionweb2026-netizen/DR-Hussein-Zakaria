-- Articles. `is_featured` replaces the current singleton `featured` JSON
-- object + separate `items[]` array (which today share an identical shape
-- anyway) with one table and a boolean, enforced to at most one featured
-- row via a partial unique index. `content` keeps the existing "\n\n"
-- paragraph-break convention so the frontend's existing split-on-paragraph
-- rendering (ArticleBody) needs no change.

create table public.articles_page_content (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  hero_eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_eyebrow)),
  hero_heading_prefix jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_heading_prefix)),
  hero_heading_highlight jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_heading_highlight)),
  hero_paragraph jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_paragraph)),
  read_more_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(read_more_label)),
  updated_at timestamptz not null default now()
);

insert into public.articles_page_content (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;

create trigger set_updated_at before update on public.articles_page_content
  for each row execute function public.set_updated_at();

alter table public.articles_page_content enable row level security;

create policy "articles_page_content_public_read" on public.articles_page_content
  for select to anon, authenticated using (true);

create policy "articles_page_content_admin_update" on public.articles_page_content
  for update to authenticated using (public.is_admin()) with check (public.is_admin());


create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(category)),
  title jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(title)),
  excerpt jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(excerpt)),
  content jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(content)),
  image_media_id uuid references public.media (id) on delete set null,
  is_featured boolean not null default false,
  published_date date not null default current_date,
  author jsonb check (author is null or public.is_bilingual(author)),
  reading_time text,
  seo_title jsonb check (seo_title is null or public.is_bilingual(seo_title)),
  seo_description jsonb check (seo_description is null or public.is_bilingual(seo_description)),
  sort_order int not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- At most one featured, published article at a time. Partial index so
-- non-featured rows (the overwhelming majority) never contend for it.
create unique index articles_one_featured_idx on public.articles (is_featured)
  where is_featured = true;

create trigger set_updated_at before update on public.articles
  for each row execute function public.set_updated_at();

do $$
begin
  execute 'alter table public.articles enable row level security;';
  execute 'create policy articles_public_read on public.articles for select to anon, authenticated using (status = ''published'');';
  execute 'create policy articles_admin_read on public.articles for select to authenticated using (public.is_admin());';
  execute 'create policy articles_admin_insert on public.articles for insert to authenticated with check (public.is_admin());';
  execute 'create policy articles_admin_update on public.articles for update to authenticated using (public.is_admin()) with check (public.is_admin());';
  execute 'create policy articles_admin_delete on public.articles for delete to authenticated using (public.is_admin());';
end $$;
