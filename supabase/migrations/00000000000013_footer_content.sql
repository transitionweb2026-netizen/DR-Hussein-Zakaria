-- Footer's own copy (description paragraph, column titles, working hours,
-- copyright). Contact details themselves live in site_settings; links come
-- from nav_items/service_categories -- this table only holds text that
-- doesn't belong anywhere else, closing a gap the original table list
-- missed.

create table public.footer_content (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  description jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(description)),
  quick_links_title jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(quick_links_title)),
  services_title jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(services_title)),
  contact_title jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(contact_title)),
  hours_title jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hours_title)),
  weekdays_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(weekdays_label)),
  weekday_hours jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(weekday_hours)),
  weekend_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(weekend_label)),
  weekend_status jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(weekend_status)),
  copyright jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(copyright)),
  updated_at timestamptz not null default now()
);

insert into public.footer_content (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;

create trigger set_updated_at before update on public.footer_content
  for each row execute function public.set_updated_at();

alter table public.footer_content enable row level security;

create policy "footer_content_public_read" on public.footer_content
  for select to anon, authenticated using (true);

create policy "footer_content_admin_update" on public.footer_content
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
