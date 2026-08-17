-- YABOAZ shared Supabase member approval schema
create table if not exists public.yaboaz_admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.yaboaz_member_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  company_name text not null default '',
  phone text not null default '',
  status text not null default 'pending' check (status in ('pending','approved','rejected','blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.yaboaz_is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.yaboaz_admin_users where user_id = auth.uid()); $$;

create or replace function public.yaboaz_create_member_profile()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.yaboaz_member_profiles (user_id, email, full_name, company_name, phone)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'company_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  ) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists yaboaz_on_auth_user_created on auth.users;
create trigger yaboaz_on_auth_user_created
after insert on auth.users
for each row execute procedure public.yaboaz_create_member_profile();

alter table public.yaboaz_admin_users enable row level security;
alter table public.yaboaz_member_profiles enable row level security;

drop policy if exists "yaboaz admin self read" on public.yaboaz_admin_users;
create policy "yaboaz admin self read" on public.yaboaz_admin_users
for select to authenticated using (user_id = auth.uid());

drop policy if exists "yaboaz member self read" on public.yaboaz_member_profiles;
create policy "yaboaz member self read" on public.yaboaz_member_profiles
for select to authenticated using (user_id = auth.uid() or public.yaboaz_is_admin());

drop policy if exists "yaboaz member self insert" on public.yaboaz_member_profiles;
create policy "yaboaz member self insert" on public.yaboaz_member_profiles
for insert to authenticated with check (user_id = auth.uid() and status = 'pending');

drop policy if exists "yaboaz admin update" on public.yaboaz_member_profiles;
create policy "yaboaz admin update" on public.yaboaz_member_profiles
for update to authenticated using (public.yaboaz_is_admin()) with check (public.yaboaz_is_admin());

-- 관리자 계정으로 회원가입한 뒤 한 번만 실행하세요.
-- insert into public.yaboaz_admin_users (user_id)
-- select id from auth.users where email = 'jaiwshim@gmail.com'
-- on conflict do nothing;
