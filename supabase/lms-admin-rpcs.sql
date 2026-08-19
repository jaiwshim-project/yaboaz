create or replace function public.yaboaz_lms_admin_members(p_password text)
returns table(user_id uuid,email text,full_name text,company_name text,status text,created_at timestamptz,total_stages bigint,completed_stages bigint,progress numeric,last_activity timestamptz)
language plpgsql security definer set search_path = public, extensions
as $$
begin
  if not exists (select 1 from public.yaboaz_dashboard_access where id=true and password_hash=digest(trim(p_password),'sha256')) then return; end if;
  return query
  select p.user_id,p.email,p.full_name,p.company_name,p.status,p.created_at,
    13::bigint,
    count(r.stage_no) filter (where r.status='approved'),
    coalesce(round(avg(r.completion_percent)),0),
    max(r.updated_at)
  from public.yaboaz_member_profiles p
  left join public.lms_enrollments e on e.user_id=p.user_id
  left join public.lms_stage_records r on r.enrollment_id=e.id
  group by p.user_id,p.email,p.full_name,p.company_name,p.status,p.created_at
  order by p.created_at desc;
end;
$$;

grant execute on function public.yaboaz_lms_admin_members(text) to anon, authenticated;

create or replace function public.yaboaz_lms_admin_member_detail(p_password text,p_user_id uuid)
returns table(stage_no integer,stage_key text,title text,status text,completion_percent integer,form_data jsonb,ai_output jsonb,feedback text,updated_at timestamptz,submitted_at timestamptz,reviewed_at timestamptz)
language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.yaboaz_dashboard_access where id=true and password_hash=digest(trim(p_password),'sha256')) then return; end if;
  return query
  select d.stage_no,d.stage_key,d.title,coalesce(r.status,'not_started'),coalesce(r.completion_percent,0),coalesce(r.form_data,'{}'::jsonb),coalesce(r.ai_output,'{}'::jsonb),coalesce(r.feedback,''),r.updated_at,r.submitted_at,r.reviewed_at
  from public.lms_stage_definitions d
  join public.lms_courses c on c.id=d.course_id and c.course_key='kfde-13-stage'
  left join public.lms_enrollments e on e.user_id=p_user_id and e.course_id=c.id
  left join public.lms_stage_records r on r.enrollment_id=e.id and r.stage_no=d.stage_no
  order by d.stage_no;
end;
$$;

grant execute on function public.yaboaz_lms_admin_member_detail(text,uuid) to anon, authenticated;

create or replace function public.yaboaz_lms_admin_review_stage(p_password text,p_stage_record_id uuid,p_status text,p_feedback text)
returns boolean language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.yaboaz_dashboard_access where id=true and password_hash=digest(trim(p_password),'sha256')) then return false; end if;
  if p_status not in ('reviewing','revision_requested','approved') then return false; end if;
  update public.lms_stage_records set status=p_status,feedback=coalesce(p_feedback,''),reviewed_at=now(),updated_at=now() where id=p_stage_record_id;
  return found;
end;
$$;

grant execute on function public.yaboaz_lms_admin_review_stage(text,uuid,text,text) to anon, authenticated;
create or replace function public.yaboaz_lms_admin_review_member_stage(p_password text,p_user_id uuid,p_stage_no integer,p_status text,p_feedback text)
returns boolean language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.yaboaz_dashboard_access where id=true and password_hash=digest(trim(p_password),'sha256')) then return false; end if;
  if p_status not in ('reviewing','revision_requested','approved') then return false; end if;
  update public.lms_stage_records r set status=p_status,feedback=coalesce(p_feedback,''),reviewed_at=now(),updated_at=now()
  from public.lms_enrollments e where r.enrollment_id=e.id and e.user_id=p_user_id and r.stage_no=p_stage_no;
  return found;
end;
$$;

grant execute on function public.yaboaz_lms_admin_review_member_stage(text,uuid,integer,text,text) to anon, authenticated;
create table if not exists public.lms_materials (
  id uuid primary key default gen_random_uuid(),
  material_key text not null unique,
  title text not null,
  material_type text not null check (material_type in ('html','slide','video','pdf','other')),
  source_url text not null,
  metadata jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lms_material_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  material_id uuid not null references public.lms_materials(id) on delete cascade,
  status text not null default 'viewed' check (status in ('viewed','in_progress','completed')),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  last_position text not null default '',
  notes text not null default '',
  first_viewed_at timestamptz not null default now(),
  last_viewed_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(user_id, material_id)
);

create index if not exists lms_material_progress_user_idx on public.lms_material_progress(user_id, last_viewed_at desc);
create index if not exists lms_materials_type_idx on public.lms_materials(material_type);

alter table public.lms_materials enable row level security;
alter table public.lms_material_progress enable row level security;

drop policy if exists lms_materials_read on public.lms_materials;
create policy lms_materials_read on public.lms_materials for select to authenticated using (is_active = true or public.yaboaz_is_admin());

drop policy if exists lms_material_progress_own on public.lms_material_progress;
create policy lms_material_progress_own on public.lms_material_progress for all to authenticated using (user_id = auth.uid() or public.yaboaz_is_admin()) with check (user_id = auth.uid() or public.yaboaz_is_admin());

drop trigger if exists lms_materials_updated_at on public.lms_materials;
create trigger lms_materials_updated_at before update on public.lms_materials for each row execute function public.lms_touch_updated_at();
drop trigger if exists lms_material_progress_updated_at on public.lms_material_progress;
create trigger lms_material_progress_updated_at before update on public.lms_material_progress for each row execute function public.lms_touch_updated_at();

create or replace function public.lms_track_material(
  p_material_key text,
  p_title text,
  p_material_type text,
  p_source_url text,
  p_status text default 'viewed',
  p_progress_percent integer default 0,
  p_last_position text default '',
  p_notes text default '',
  p_metadata jsonb default '{}'::jsonb
)
returns public.lms_material_progress
language plpgsql security definer set search_path = public
as $$
declare material public.lms_materials; saved public.lms_material_progress;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if p_material_type not in ('html','slide','video','pdf','other') then raise exception 'invalid material type'; end if;
  if p_status not in ('viewed','in_progress','completed') then raise exception 'invalid material status'; end if;
  insert into public.lms_materials(material_key,title,material_type,source_url,metadata)
  values(p_material_key,coalesce(nullif(p_title,''),p_material_key),p_material_type,p_source_url,coalesce(p_metadata,'{}'::jsonb))
  on conflict(material_key) do update set title=excluded.title,material_type=excluded.material_type,source_url=excluded.source_url,metadata=excluded.metadata,updated_at=now()
  returning * into material;
  insert into public.lms_material_progress(user_id,material_id,status,progress_percent,last_position,notes,completed_at)
  values(auth.uid(),material.id,p_status,greatest(0,least(100,coalesce(p_progress_percent,0))),coalesce(p_last_position,''),coalesce(p_notes,''),case when p_status='completed' then now() else null end)
  on conflict(user_id,material_id) do update set status=excluded.status,progress_percent=greatest(public.lms_material_progress.progress_percent,excluded.progress_percent),last_position=excluded.last_position,notes=excluded.notes,last_viewed_at=now(),completed_at=case when excluded.status='completed' then coalesce(public.lms_material_progress.completed_at,now()) else public.lms_material_progress.completed_at end,updated_at=now()
  returning * into saved;
  insert into public.lms_activity_events(user_id,event_type,metadata) values(auth.uid(),'material_'+p_status,jsonb_build_object('material_key',p_material_key,'material_type',p_material_type,'progress_percent',p_progress_percent,'last_position',p_last_position));
  return saved;
end;
$$;

grant execute on function public.lms_track_material(text,text,text,text,text,integer,text,text,jsonb) to authenticated;

create or replace function public.yaboaz_lms_admin_materials(p_password text,p_user_id uuid)
returns table(material_id uuid,material_key text,title text,material_type text,source_url text,status text,progress_percent integer,last_position text,notes text,first_viewed_at timestamptz,last_viewed_at timestamptz,completed_at timestamptz,updated_at timestamptz)
language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.yaboaz_dashboard_access where id=true and password_hash=digest(trim(p_password),'sha256')) then return; end if;
  return query
  select m.id,m.material_key,m.title,m.material_type,m.source_url,coalesce(p.status,'not_started'),coalesce(p.progress_percent,0),coalesce(p.last_position,''),coalesce(p.notes,''),p.first_viewed_at,p.last_viewed_at,p.completed_at,p.updated_at
  from public.lms_materials m
  left join public.lms_material_progress p on p.material_id=m.id and p.user_id=p_user_id
  where m.is_active = true
  order by case when p.last_viewed_at is null then 1 else 0 end,m.material_type,m.title;
end;
$$;

grant execute on function public.yaboaz_lms_admin_materials(text,uuid) to anon, authenticated;

