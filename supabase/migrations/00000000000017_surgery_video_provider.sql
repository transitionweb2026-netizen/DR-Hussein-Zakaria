-- Same gap as home_video_intro: surgeries.video_url existed with no
-- video_provider to disambiguate an iframe embed from a direct mp4.
-- Additive, nullable -- no existing data affected.

alter table public.surgeries
  add column video_provider text check (video_provider is null or video_provider in ('youtube', 'vimeo', 'mp4'));
