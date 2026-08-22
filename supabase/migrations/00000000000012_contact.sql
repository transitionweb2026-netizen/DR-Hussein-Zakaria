-- Contact page copy. Actual contact details (phone/WhatsApp/email/address)
-- live in site_settings, not here -- this table only holds this page's own
-- hero and contact-form field labels/placeholders.

create table public.contact_page_content (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  hero_eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_eyebrow)),
  hero_heading_prefix jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_heading_prefix)),
  hero_heading_highlight jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_heading_highlight)),
  hero_paragraph jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(hero_paragraph)),
  form_eyebrow jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(form_eyebrow)),
  form_heading jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(form_heading)),
  form_name_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(form_name_label)),
  form_name_placeholder jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(form_name_placeholder)),
  form_email_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(form_email_label)),
  form_email_placeholder jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(form_email_placeholder)),
  form_phone_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(form_phone_label)),
  form_phone_placeholder jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(form_phone_placeholder)),
  form_message_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(form_message_label)),
  form_message_placeholder jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(form_message_placeholder)),
  form_submit_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(form_submit_label)),
  form_sending_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(form_sending_label)),
  form_success_message jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(form_success_message)),
  form_or_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(form_or_label)),
  map_label jsonb not null default '{"en":"","ar":""}'::jsonb check (public.is_bilingual(map_label)),
  map_embed_url text,
  updated_at timestamptz not null default now()
);

insert into public.contact_page_content (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;

create trigger set_updated_at before update on public.contact_page_content
  for each row execute function public.set_updated_at();

alter table public.contact_page_content enable row level security;

create policy "contact_page_content_public_read" on public.contact_page_content
  for select to anon, authenticated using (true);

create policy "contact_page_content_admin_update" on public.contact_page_content
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
