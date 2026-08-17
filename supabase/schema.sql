-- K-FDE local-first data bridge
create table if not exists public.fde_kv (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.fde_kv enable row level security;

create policy "K-FDE anonymous read" on public.fde_kv
  for select to anon using (true);
create policy "K-FDE anonymous insert" on public.fde_kv
  for insert to anon with check (true);
create policy "K-FDE anonymous update" on public.fde_kv
  for update to anon using (true) with check (true);
create policy "K-FDE anonymous delete" on public.fde_kv
  for delete to anon using (true);
