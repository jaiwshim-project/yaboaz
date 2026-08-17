-- YABOAZ member approval schema
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.member_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  company_name text not null,
  phone text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admin_users where user_id = auth.uid()); $$;

alter table public.admin_users enable row level security;
alter table public.member_profiles enable row level security;

drop policy if exists "admins can read admin users" on public.admin_users;
create policy "admins can read admin users" on public.admin_users for select to authenticated using (user_id = auth.uid());

drop policy if exists "members can create own profile" on public.member_profiles;
create policy "members can create own profile" on public.member_profiles for insert to authenticated with check (user_id = auth.uid() and status = 'pending');

drop policy if exists "members can read own profile" on public.member_profiles;
create policy "members can read own profile" on public.member_profiles for select to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "admins can update profiles" on public.member_profiles;
create policy "admins can update profiles" on public.member_profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins can read all profiles" on public.member_profiles;
create policy "admins can read all profiles" on public.member_profiles for select to authenticated using (public.is_admin());

alter table public.member_profiles add column if not exists phone text not null default '';

-- Run this once after the owner account has signed up:
-- insert into public.admin_users (user_id) select id from auth.users where email = 'jaiwshim@gmail.com' on conflict do nothing;



