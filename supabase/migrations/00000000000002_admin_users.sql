-- Admin accounts. This table is the anchor every RLS policy in later
-- migrations checks against. Rows are created manually (Supabase Dashboard
-- "Add user" + a matching INSERT here via the SQL editor) -- there is no
-- app-level sign-up flow and no service-role bootstrap script, by design.

create table public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- security definer + explicit search_path: lets this function read
-- admin_users regardless of the calling user's own RLS visibility, which is
-- what avoids a circular "you must already be an admin to check if you're an
-- admin" deadlock. Every other migration's policies call this instead of
-- repeating the EXISTS subquery.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users a where a.id = auth.uid()
  );
$$;

-- Admins can see the list of admins (useful for a future "manage admins"
-- screen). No INSERT/UPDATE/DELETE policy is defined here on purpose: with
-- RLS enabled and no matching policy, those operations are denied by
-- default for every role, including authenticated admins -- membership is
-- managed only through the Dashboard/SQL editor.
create policy "admin_users_admin_read" on public.admin_users
  for select to authenticated
  using (public.is_admin());
