-- home_video_intro already has video_url (added in the original migration)
-- but was missed getting the same video_provider column the `videos` table
-- has, so real playback couldn't tell an iframe embed from a direct mp4.
-- Additive, nullable -- no existing data affected.

alter table public.home_video_intro
  add column video_provider text check (video_provider is null or video_provider in ('youtube', 'vimeo', 'mp4'));
