-- Oori Woodworking CRM — pipeline status, follow-up reminders, activity log.
-- Idempotent: safe to run more than once.

alter table public.leads
  add column if not exists status text not null default 'new',
  add column if not exists follow_up_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'leads_status_check'
  ) then
    alter table public.leads
      add constraint leads_status_check
      check (status in ('new', 'contacted', 'quoted', 'won', 'lost'));
  end if;
end $$;

create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_follow_up_at_idx on public.leads (follow_up_at);

-- Activity log: notes, status changes, follow-up changes. Fully private —
-- no RLS policies for anon/authenticated are defined below, so only the
-- service role (used server-side by the /admin API routes) can read or
-- write it. The public website never touches this table.
create table if not exists public.lead_activity (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references public.leads(id) on delete cascade,
  type       text not null check (type in ('note', 'status_change', 'follow_up_set', 'follow_up_cleared')),
  body       text,
  created_at timestamptz not null default now()
);

alter table public.lead_activity enable row level security;

create index if not exists lead_activity_lead_id_idx on public.lead_activity (lead_id, created_at desc);
