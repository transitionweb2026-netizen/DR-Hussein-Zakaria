-- Shared "doctor facts" tables. These are reused by both the Home page and
-- the new About page, so career history / credentials / specialties are
-- maintained in exactly one place rather than drifting apart across two
-- pages -- the same single-source-of-truth principle applied to phone/
-- WhatsApp numbers in site_settings.

create table public.career_timeline (
  id uuid primary key default gen_random_uuid(),
  year text not null default '',
  title jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(title)),
  description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(description)),
  icon text not null default 'graduation-cap',
  sort_order int not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(title)),
  issuer jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(issuer)),
  year text not null default '',
  image_media_id uuid references public.media (id) on delete set null,
  sort_order int not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Reused by: the homepage specialty grid, the /services page's category
-- list, the About page's Specialties section, AND as the FK target for
-- surgeries below -- replacing the current `services.items` JSON array
-- that today serves the first two purposes with divergent-risk duplication.
create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(title)),
  description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(description)),
  icon text not null default 'brain',
  image_media_id uuid references public.media (id) on delete set null,
  sort_order int not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.career_timeline
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.certificates
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.service_categories
  for each row execute function public.set_updated_at();

-- Standard repeatable-content RLS (public reads published rows, admins can
-- read everything and write). Applied here explicitly for these three
-- tables; the bulk "apply to every remaining repeatable table" loop lives
-- in the final RLS migration once all tables exist.
do $$
declare
  t text;
  tables text[] := array['career_timeline', 'certificates', 'service_categories'];
begin
  foreach t in array tables loop
    execute format('alter table public.%I enable row level security;', t);
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (status = ''published'');',
      t || '_public_read', t
    );
    execute format(
      'create policy %I on public.%I for select to authenticated using (public.is_admin());',
      t || '_admin_read', t
    );
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (public.is_admin());',
      t || '_admin_insert', t
    );
    execute format(
      'create policy %I on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin());',
      t || '_admin_update', t
    );
    execute format(
      'create policy %I on public.%I for delete to authenticated using (public.is_admin());',
      t || '_admin_delete', t
    );
  end loop;
end $$;
