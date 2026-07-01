-- Oori Woodworking — leads table for quote requests (RFQ).
-- Idempotent: safe to run more than once.

create table if not exists public.leads (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  full_name         text not null,
  phone             text,
  email             text,
  project_type      text,
  budget            text,
  timeline          text,
  description       text,
  preferred_contact text,
  consent           boolean not null default false,
  locale            text not null default 'he',
  source            text,
  user_agent        text
);

-- Row Level Security: the public website may INSERT leads, but nobody
-- can read them via the anon key. Read leads in the Supabase dashboard
-- (or with the service role / an authenticated admin).
alter table public.leads enable row level security;

drop policy if exists "anon can insert leads" on public.leads;
create policy "anon can insert leads"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
