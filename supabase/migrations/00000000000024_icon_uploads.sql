-- Custom-icon-image upload support: five tables where the admin already
-- picks an icon from a fixed key (service_categories, home_stats,
-- career_timeline, why_choose_reasons, social_links) gain an additive
-- icon_media_id column. When set, the frontend shows the uploaded image
-- instead of the library icon; when null (the default -- nothing changes
-- for existing rows), the current icon-key behavior is unchanged. Every
-- other content type with an icon-like image already has one
-- (technologies.image_media_id already does exactly this).

alter table public.service_categories
  add column if not exists icon_media_id uuid references public.media (id) on delete set null;

alter table public.home_stats
  add column if not exists icon_media_id uuid references public.media (id) on delete set null;

alter table public.career_timeline
  add column if not exists icon_media_id uuid references public.media (id) on delete set null;

alter table public.why_choose_reasons
  add column if not exists icon_media_id uuid references public.media (id) on delete set null;

alter table public.social_links
  add column if not exists icon_media_id uuid references public.media (id) on delete set null;
