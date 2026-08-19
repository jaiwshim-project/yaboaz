-- YABOAZ LMS schema
-- Apply after supabase-member-approval.sql in the Supabase SQL editor.

create table if not exists public.lms_courses (
  id uuid primary key default gen_random_uuid(),
  course_key text not null unique,
  title text not null,
  description text not null default '',
  status text not null default 'active' check (status in ('draft','active','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lms_stage_definitions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  stage_no integer not null check (stage_no between 1 and 13),
  stage_key text not null,
  title text not null,
  description text not null default '',
  form_schema jsonb not null default '[]'::jsonb,
  completion_rules jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(course_id, stage_no),
  unique(course_id, stage_key)
);

create table if not exists public.lms_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  status text not null default 'active' check (status in ('invited','active','paused','completed','withdrawn')),
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(user_id, course_id)
);

create table if not exists public.lms_stage_records (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.lms_enrollments(id) on delete cascade,
  stage_no integer not null check (stage_no between 1 and 13),
  status text not null default 'not_started' check (status in ('not_started','draft','submitted','reviewing','revision_requested','approved')),
  form_data jsonb not null default '{}'::jsonb,
  ai_output jsonb not null default '{}'::jsonb,
  completion_percent integer not null default 0 check (completion_percent between 0 and 100),
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  feedback text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(enrollment_id, stage_no)
);

create table if not exists public.lms_stage_versions (
  id uuid primary key default gen_random_uuid(),
  stage_record_id uuid not null references public.lms_stage_records(id) on delete cascade,
  version_no integer not null,
  form_data jsonb not null default '{}'::jsonb,
  ai_output jsonb not null default '{}'::jsonb,
  status text not null,
  changed_by uuid references auth.users(id) on delete set null,
  change_reason text not null default 'autosave',
  created_at timestamptz not null default now(),
  unique(stage_record_id, version_no)
);

create table if not exists public.lms_activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid references public.lms_courses(id) on delete set null,
  stage_no integer check (stage_no between 1 and 13),
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.lms_admin_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stage_no integer check (stage_no between 1 and 13),
  note text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists lms_enrollments_user_idx on public.lms_enrollments(user_id);
create index if not exists lms_stage_records_enrollment_idx on public.lms_stage_records(enrollment_id);
create index if not exists lms_stage_versions_record_idx on public.lms_stage_versions(stage_record_id, version_no desc);
create index if not exists lms_activity_events_user_idx on public.lms_activity_events(user_id, created_at desc);
create index if not exists lms_admin_notes_user_idx on public.lms_admin_notes(user_id, created_at desc);

create or replace function public.lms_touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists lms_courses_touch on public.lms_courses;
create trigger lms_courses_touch before update on public.lms_courses for each row execute procedure public.lms_touch_updated_at();
drop trigger if exists lms_stage_definitions_touch on public.lms_stage_definitions;
create trigger lms_stage_definitions_touch before update on public.lms_stage_definitions for each row execute procedure public.lms_touch_updated_at();
drop trigger if exists lms_enrollments_touch on public.lms_enrollments;
create trigger lms_enrollments_touch before update on public.lms_enrollments for each row execute procedure public.lms_touch_updated_at();
drop trigger if exists lms_stage_records_touch on public.lms_stage_records;
create trigger lms_stage_records_touch before update on public.lms_stage_records for each row execute procedure public.lms_touch_updated_at();

alter table public.lms_courses enable row level security;
alter table public.lms_stage_definitions enable row level security;
alter table public.lms_enrollments enable row level security;
alter table public.lms_stage_records enable row level security;
alter table public.lms_stage_versions enable row level security;
alter table public.lms_activity_events enable row level security;
alter table public.lms_admin_notes enable row level security;

create policy "lms authenticated courses read" on public.lms_courses for select to authenticated using (status = 'active' or public.yaboaz_is_admin());
create policy "lms authenticated stage definitions read" on public.lms_stage_definitions for select to authenticated using (true);
create policy "lms member enrollment read" on public.lms_enrollments for select to authenticated using (user_id = auth.uid() or public.yaboaz_is_admin());
create policy "lms member enrollment insert" on public.lms_enrollments for insert to authenticated with check (user_id = auth.uid());
create policy "lms member enrollment update" on public.lms_enrollments for update to authenticated using (user_id = auth.uid() or public.yaboaz_is_admin()) with check (user_id = auth.uid() or public.yaboaz_is_admin());
create policy "lms member stage read" on public.lms_stage_records for select to authenticated using (exists (select 1 from public.lms_enrollments e where e.id = enrollment_id and (e.user_id = auth.uid() or public.yaboaz_is_admin())));
create policy "lms member stage insert" on public.lms_stage_records for insert to authenticated with check (exists (select 1 from public.lms_enrollments e where e.id = enrollment_id and e.user_id = auth.uid()));
create policy "lms member stage update" on public.lms_stage_records for update to authenticated using (exists (select 1 from public.lms_enrollments e where e.id = enrollment_id and (e.user_id = auth.uid() or public.yaboaz_is_admin()))) with check (exists (select 1 from public.lms_enrollments e where e.id = enrollment_id and (e.user_id = auth.uid() or public.yaboaz_is_admin())));
create policy "lms member versions read" on public.lms_stage_versions for select to authenticated using (exists (select 1 from public.lms_stage_records r join public.lms_enrollments e on e.id = r.enrollment_id where r.id = stage_record_id and (e.user_id = auth.uid() or public.yaboaz_is_admin())));
create policy "lms member events read" on public.lms_activity_events for select to authenticated using (user_id = auth.uid() or public.yaboaz_is_admin());
create policy "lms member events insert" on public.lms_activity_events for insert to authenticated with check (user_id = auth.uid());
create policy "lms admin notes read" on public.lms_admin_notes for select to authenticated using (user_id = auth.uid() or public.yaboaz_is_admin());
create policy "lms admin notes insert" on public.lms_admin_notes for insert to authenticated with check (public.yaboaz_is_admin());

create or replace function public.lms_get_or_create_enrollment(p_course_key text)
returns public.lms_enrollments language plpgsql security definer set search_path = public
as $$
declare result public.lms_enrollments;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  select e.* into result from public.lms_enrollments e join public.lms_courses c on c.id=e.course_id where e.user_id=auth.uid() and c.course_key=p_course_key limit 1;
  if result.id is null then
    insert into public.lms_enrollments(user_id,course_id) select auth.uid(),id from public.lms_courses where course_key=p_course_key and status='active' returning * into result;
  end if;
  if result.id is null then raise exception 'course not found'; end if;
  return result;
end;
$$;

grant execute on function public.lms_get_or_create_enrollment(text) to authenticated;

insert into public.lms_courses(course_key,title,description,status)
values ('kfde-13-stage','YABOAZ K-FDE 13단계 실행 과정','현장의 문제를 실행 가능한 플랫폼 자산으로 전환하는 13단계 학습 과정','active')
on conflict (course_key) do nothing;
insert into public.lms_stage_definitions(course_id,stage_no,stage_key,title,description,form_schema,completion_rules)
select c.id, v.stage_no, v.stage_key, v.title, v.description, v.form_schema::jsonb, v.completion_rules::jsonb
from public.lms_courses c
cross join (values
  (1,'customer-onboarding','고객 온보딩','프로젝트 경계와 고객 목표를 설정한다','[]','{"required":[]}'),
  (2,'initial-materials','초기자료 정규화','자료·출처·품질을 정리한다','[]','{"required":[]}'),
  (3,'problem-solving','2A4 문제해결','목표·문제·원인·실행을 구조화한다','[]','{"required":[]}'),
  (4,'field-discovery','이해관계자·현장 탐색','가설과 조사 방향을 정한다','[]','{"required":[]}'),
  (5,'interview','맞춤 인터뷰','질문과 기대 결과를 확인한다','[]','{"required":[]}'),
  (6,'ontology','온톨로지 7요소','객체·속성·관계·상태·이벤트·규칙·행동을 설계한다','[]','{"required":[]}'),
  (7,'ai-scenarios','AI 판단 시나리오','근거·판단·승인 흐름을 설계한다','[]','{"required":[]}'),
  (8,'agent-design','AI Agent 설계','역할·도구·권한을 설계한다','[]','{"required":[]}'),
  (9,'workflow-design','워크플로 설계','상태·게이트·예외 흐름을 설계한다','[]','{"required":[]}'),
  (10,'screen-data-model','화면·데이터 모델','UX·데이터·API·권한을 연결한다','[]','{"required":[]}'),
  (11,'mvp-development','MVP 개발','핵심 실행 단위를 구현한다','[]','{"required":[]}'),
  (12,'bootcamp-validation','Bootcamp 검증','현장 사용성·정확성·성과를 검증한다','[]','{"required":[]}'),
  (13,'assetization','플랫폼 자산화','검증 결과를 재사용 자산으로 패키징한다','[]','{"required":[]}')
) as v(stage_no,stage_key,title,description,form_schema,completion_rules)
where c.course_key='kfde-13-stage'
on conflict(course_id,stage_no) do update set stage_key=excluded.stage_key,title=excluded.title,description=excluded.description,form_schema=excluded.form_schema,completion_rules=excluded.completion_rules,updated_at=now();
create or replace function public.lms_save_stage_record(
  p_course_key text,
  p_stage_no integer,
  p_form_data jsonb,
  p_completion_percent integer default 0,
  p_status text default 'draft'
)
returns public.lms_stage_records language plpgsql security definer set search_path = public
as $$
declare enrollment public.lms_enrollments; saved public.lms_stage_records; next_version integer;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if p_stage_no < 1 or p_stage_no > 13 then raise exception 'invalid stage'; end if;
  if p_status not in ('not_started','draft','submitted','reviewing','revision_requested','approved') then raise exception 'invalid status'; end if;
  select e.* into enrollment from public.lms_enrollments e join public.lms_courses c on c.id=e.course_id where e.user_id=auth.uid() and c.course_key=p_course_key limit 1;
  if enrollment.id is null then raise exception 'enrollment not found'; end if;
  insert into public.lms_stage_records(enrollment_id,stage_no,status,form_data,completion_percent,submitted_at)
  values(enrollment.id,p_stage_no,p_status,coalesce(p_form_data,'{}'::jsonb),greatest(0,least(100,coalesce(p_completion_percent,0))),case when p_status='submitted' then now() else null end)
  on conflict(enrollment_id,stage_no) do update set
    form_data=excluded.form_data,
    completion_percent=excluded.completion_percent,
    status=case when public.lms_stage_records.status='approved' and p_status='draft' then 'revision_requested' else excluded.status end,
    submitted_at=case when p_status='submitted' then coalesce(public.lms_stage_records.submitted_at,now()) else public.lms_stage_records.submitted_at end,
    updated_at=now()
  returning * into saved;
  select coalesce(max(version_no),0)+1 into next_version from public.lms_stage_versions where stage_record_id=saved.id;
  insert into public.lms_stage_versions(stage_record_id,version_no,form_data,ai_output,status,changed_by)
  values(saved.id,next_version,saved.form_data,saved.ai_output,saved.status,auth.uid());
  insert into public.lms_activity_events(user_id,course_id,stage_no,event_type,metadata)
  values(auth.uid(),enrollment.course_id,p_stage_no,'stage_saved',jsonb_build_object('status',saved.status,'completion_percent',saved.completion_percent));
  return saved;
end;
$$;

grant execute on function public.lms_save_stage_record(text,integer,jsonb,integer,text) to authenticated;

create or replace function public.lms_submit_stage(p_course_key text, p_stage_no integer)
returns public.lms_stage_records language plpgsql security definer set search_path = public
as $$
declare enrollment public.lms_enrollments; saved public.lms_stage_records;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  select e.* into enrollment from public.lms_enrollments e join public.lms_courses c on c.id=e.course_id where e.user_id=auth.uid() and c.course_key=p_course_key limit 1;
  if enrollment.id is null then raise exception 'enrollment not found'; end if;
  update public.lms_stage_records set status='submitted',submitted_at=now(),updated_at=now() where lms_stage_records.enrollment_id=enrollment.id and lms_stage_records.stage_no=p_stage_no returning * into saved;
  if saved.id is null then raise exception 'stage record not found'; end if;
  insert into public.lms_activity_events(user_id,course_id,stage_no,event_type) values(auth.uid(),enrollment.course_id,p_stage_no,'stage_submitted');
  return saved;
end;
$$;

grant execute on function public.lms_submit_stage(text,integer) to authenticated;
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
  on conflict(user_id,material_id) do update set
    status=case when public.lms_material_progress.status='completed' then 'completed' else excluded.status end,
    progress_percent=greatest(public.lms_material_progress.progress_percent,excluded.progress_percent),
    last_position=case when excluded.last_position='' then public.lms_material_progress.last_position else excluded.last_position end,
    notes=case when excluded.notes='' then public.lms_material_progress.notes else excluded.notes end,
    last_viewed_at=now(),
    completed_at=case when public.lms_material_progress.status='completed' or excluded.status='completed' then coalesce(public.lms_material_progress.completed_at,now()) else null end,
    updated_at=now()
  returning * into saved;
  insert into public.lms_activity_events(user_id,event_type,metadata) values(auth.uid(),'material_'+p_status,jsonb_build_object('material_key',p_material_key,'material_type',p_material_type,'progress_percent',p_progress_percent,'last_position',p_last_position));
  return saved;
end;
$$;

create or replace function public.lms_get_my_material_progress(p_material_key text default null)
returns table(material_key text,status text,progress_percent integer,last_position text,notes text,completed_at timestamptz)
language sql security definer set search_path = public
as $$
  select m.material_key,coalesce(p.status,'not_started'),coalesce(p.progress_percent,0),coalesce(p.last_position,''),coalesce(p.notes,''),p.completed_at
  from public.lms_materials m
  left join public.lms_material_progress p on p.material_id=m.id and p.user_id=auth.uid()
  where auth.uid() is not null and (p_material_key is null or m.material_key=p_material_key)
  order by m.material_key;
$$;

grant execute on function public.lms_get_my_material_progress(text) to authenticated;

