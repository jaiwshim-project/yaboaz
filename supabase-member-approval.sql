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

-- Access codes are provisioned as hashes only. Never insert the plaintext code.
create extension if not exists pgcrypto;

create table if not exists public.yaboaz_access_codes (
  id uuid primary key default gen_random_uuid(),
  code_hash bytea not null unique,
  status text not null default 'available' check (status in ('available', 'assigned', 'revoked')),
  assigned_user_id uuid references auth.users(id) on delete set null,
  assigned_at timestamptz,
  created_at timestamptz not null default now(),
  constraint yaboaz_access_codes_assignment_consistency check (
    (status = 'assigned' and assigned_user_id is not null and assigned_at is not null)
    or (status <> 'assigned' and assigned_user_id is null and assigned_at is null)
  )
);

alter table public.yaboaz_access_codes enable row level security;

create or replace function public.yaboaz_access_code_available(p_code text)
returns boolean language sql stable security definer set search_path = public, extensions
as $$
  select exists (select 1 from public.yaboaz_access_codes where status = 'available' and code_hash = digest(upper(trim(p_code)), 'sha256'));
$$;

create or replace function public.yaboaz_claim_access_code(p_code text, p_user_id uuid)
returns boolean language plpgsql security definer set search_path = public, extensions
as $$
begin
  if auth.uid() is null or auth.uid() <> p_user_id then return false; end if;
  update public.yaboaz_access_codes
  set status = 'assigned', assigned_user_id = p_user_id, assigned_at = now()
  where status = 'available' and code_hash = digest(upper(trim(p_code)), 'sha256');
  return found;
end;
$$;

revoke all on function public.yaboaz_access_code_available(text) from public;
grant execute on function public.yaboaz_access_code_available(text) to anon, authenticated;
revoke all on function public.yaboaz_claim_access_code(text, uuid) from public;
grant execute on function public.yaboaz_claim_access_code(text, uuid) to authenticated;

drop policy if exists "yaboaz member self update" on public.yaboaz_member_profiles;
create policy "yaboaz member self update" on public.yaboaz_member_profiles
for update to authenticated
using (user_id = auth.uid() and status = 'pending')
with check (user_id = auth.uid() and status = 'pending');

create or replace function public.yaboaz_dashboard_delete_member(p_password text, p_user_id uuid)
returns boolean language plpgsql security definer set search_path = public, extensions
as $$
declare deleted_count integer;
begin
  if not exists (select 1 from public.yaboaz_dashboard_access where id = true and password_hash = digest(trim(p_password), 'sha256')) then return false; end if;
  delete from auth.users where id = p_user_id;
  get diagnostics deleted_count = row_count;
  return deleted_count > 0;
end;
$$;
revoke all on function public.yaboaz_dashboard_delete_member(text, uuid) from public;
grant execute on function public.yaboaz_dashboard_delete_member(text, uuid) to anon, authenticated;

create or replace function public.yaboaz_dashboard_delete_member(p_password text, p_user_id uuid)
returns boolean language plpgsql security definer set search_path = public, extensions
as $$
declare deleted_count integer;
begin
  if not exists (select 1 from public.yaboaz_dashboard_access where id = true and password_hash = digest(trim(p_password), 'sha256')) then return false; end if;
  update public.yaboaz_access_codes
  set status = 'available', assigned_user_id = null, assigned_at = null
  where assigned_user_id = p_user_id;
  delete from auth.users where id = p_user_id;
  get diagnostics deleted_count = row_count;
  return deleted_count > 0;
end;
$$;

-- Membership type migration: paid members and free testing members.
alter table public.yaboaz_member_profiles
  add column if not exists membership_type text not null default 'paid'
  check (membership_type in ('paid', 'testing'));

alter table public.yaboaz_access_codes
  add column if not exists membership_type text not null default 'paid'
  check (membership_type in ('paid', 'testing'));

create or replace function public.yaboaz_claim_access_code(p_code text, p_user_id uuid)
returns boolean language plpgsql security definer set search_path = public, extensions
as $$
declare claimed_type text;
begin
  if auth.uid() is null or auth.uid() <> p_user_id then return false; end if;
  update public.yaboaz_access_codes
  set status = 'assigned', assigned_user_id = p_user_id, assigned_at = now()
  where status = 'available' and code_hash = digest(upper(trim(p_code)), 'sha256')
  returning membership_type into claimed_type;
  if not found then return false; end if;
  update public.yaboaz_member_profiles
  set membership_type = coalesce(claimed_type, 'paid'), updated_at = now()
  where user_id = p_user_id;
  return true;
end;
$$;