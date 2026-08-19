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