-- ============================================================
-- 0001_init.sql
-- Full schema for the class-management app.
-- Run this in Supabase Dashboard → SQL Editor.
-- RLS is enabled on every table with NO public policies (deny-by-default).
-- All data access goes through Nuxt server routes using the SERVICE ROLE key.
-- ============================================================

-- ── app_users ─────────────────────────────────────────────────────────────
-- Stores every person who has attempted Telegram login.
-- telegram_id is the numeric Telegram user id (never the @username).
create table if not exists public.app_users (
  id              uuid primary key default gen_random_uuid(),
  telegram_id     bigint unique not null,
  name            text,
  username        text,                        -- Telegram @handle, may be absent
  photo_url       text,
  role            text not null default 'student'
                    check (role in ('admin', 'student')),
  status          text not null default 'pending'
                    check (status in ('pending', 'approved', 'rejected')),
  created_at      timestamptz not null default now(),
  last_login_at   timestamptz,
  approved_by     uuid references public.app_users(id),
  approved_at     timestamptz
);

alter table public.app_users enable row level security;
-- No public policies → deny by default.  Server uses service role key.

create index if not exists app_users_telegram_id_idx on public.app_users(telegram_id);
create index if not exists app_users_status_idx      on public.app_users(status);
create index if not exists app_users_role_idx        on public.app_users(role);

-- ── students ──────────────────────────────────────────────────────────────
-- Physical roster of class students (may or may not have a Telegram account).
-- Collect MINIMUM personal data; students may be minors.
create table if not exists public.students (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  contact     text,                            -- optional parent/guardian contact
  active      boolean not null default true,
  app_user_id uuid references public.app_users(id),  -- nullable; link later
  created_at  timestamptz not null default now()
);

alter table public.students enable row level security;

create index if not exists students_app_user_id_idx on public.students(app_user_id);
create index if not exists students_active_idx      on public.students(active);

-- ── class_sessions ────────────────────────────────────────────────────────
create table if not exists public.class_sessions (
  id           uuid primary key default gen_random_uuid(),
  session_date date not null,
  topic        text,
  created_at   timestamptz not null default now(),
  unique (session_date)
);

alter table public.class_sessions enable row level security;

create index if not exists class_sessions_date_idx on public.class_sessions(session_date desc);

-- ── attendance ────────────────────────────────────────────────────────────
create table if not exists public.attendance (
  id         uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.class_sessions(id) on delete cascade,
  student_id uuid not null references public.students(id)        on delete cascade,
  status     text not null check (status in ('present', 'absent', 'late')),
  unique (session_id, student_id)
);

alter table public.attendance enable row level security;

create index if not exists attendance_session_id_idx on public.attendance(session_id);
create index if not exists attendance_student_id_idx on public.attendance(student_id);

-- ── payments ──────────────────────────────────────────────────────────────
-- period is the first day of the month (e.g. 2026-11-01).
create table if not exists public.payments (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  period     date not null,                   -- first day of month
  amount     numeric(10, 2) not null,
  currency   text not null default 'USD',
  status     text not null default 'unpaid' check (status in ('paid', 'unpaid')),
  paid_at    timestamptz,
  note       text,
  unique (student_id, period)
);

alter table public.payments enable row level security;

create index if not exists payments_student_id_idx on public.payments(student_id);
create index if not exists payments_period_idx     on public.payments(period desc);

-- ── documents ─────────────────────────────────────────────────────────────
-- Metadata only; the file itself lives in the private "documents" storage bucket.
create table if not exists public.documents (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  storage_path text not null,                  -- path inside the "documents" bucket
  mime_type    text,
  size_bytes   bigint,
  uploaded_by  uuid references public.app_users(id),
  created_at   timestamptz not null default now()
);

alter table public.documents enable row level security;

create index if not exists documents_created_at_idx on public.documents(created_at desc);

-- ── announcements ─────────────────────────────────────────────────────────
create table if not exists public.announcements (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text not null,
  pinned      boolean not null default false,
  published   boolean not null default true,
  created_by  uuid references public.app_users(id),
  created_at  timestamptz not null default now()
);

alter table public.announcements enable row level security;

create index if not exists announcements_created_at_idx on public.announcements(created_at desc);
create index if not exists announcements_pinned_idx     on public.announcements(pinned) where pinned = true;

-- ── class_schedule ────────────────────────────────────────────────────────
-- Simple recurring weekly schedule (displayed in the announcements page).
create table if not exists public.class_schedule (
  id         uuid primary key default gen_random_uuid(),
  weekday    int not null check (weekday between 0 and 6),  -- 0=Sunday
  start_time time not null,
  end_time   time not null,
  room       text
);

alter table public.class_schedule enable row level security;

-- ── Supabase Storage bucket ───────────────────────────────────────────────
-- Create a PRIVATE bucket named "documents".
-- Signed URLs are issued server-side by the API; the bucket itself is not public.
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;
