-- Run this in your Supabase Dashboard -> SQL Editor for project jpunufctuyczwpbmmroi

create table if not exists public.tasks (
  id text primary key,
  title text not null,
  status text not null default 'todo',
  label text not null default 'feature',
  priority text not null default 'medium',
  created_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

-- Allow read/write access for the dashboard demo (tighten to `authenticated` for production)
drop policy if exists "Allow public read access on tasks" on public.tasks;
create policy "Allow public read access on tasks"
  on public.tasks for select
  to anon, authenticated
  using (true);

drop policy if exists "Allow public insert access on tasks" on public.tasks;
create policy "Allow public insert access on tasks"
  on public.tasks for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Allow public update access on tasks" on public.tasks;
create policy "Allow public update access on tasks"
  on public.tasks for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Allow public delete access on tasks" on public.tasks;
create policy "Allow public delete access on tasks"
  on public.tasks for delete
  to anon, authenticated
  using (true);

-- Seed sample rows
insert into public.tasks (id, title, status, label, priority)
values
  ('TASK-8782', 'You can''t compress the program without quantifying the open-source SSD pixel!', 'in progress', 'documentation', 'medium'),
  ('TASK-7878', 'Try to calculate the EXE feed, maybe it will index the multi-byte pixel!', 'backlog', 'documentation', 'medium'),
  ('TASK-7839', 'We need to bypass the neural TCP card!', 'todo', 'bug', 'high'),
  ('TASK-5562', 'The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!', 'backlog', 'feature', 'medium'),
  ('TASK-8686', 'I''ll parse the wireless SSL protocol, that should driver the API panel!', 'canceled', 'feature', 'medium'),
  ('TASK-1280', 'Use the digital TLS panel, then you can transmit the haptic system!', 'done', 'bug', 'high')
on conflict (id) do nothing;
