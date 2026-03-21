-- src/lib/supabase/migrations/001_initial_schema.sql

-- Homes table
create table homes (
  id uuid primary key default gen_random_uuid(),
  address text not null,
  year_built int,
  phase text check (phase in ('pre_inspection', 'inspection_complete', 'post_close')) default 'inspection_complete',
  created_at timestamptz default now()
);

-- Evidence table
create table evidence (
  id uuid primary key default gen_random_uuid(),
  home_id uuid references homes(id) on delete cascade,
  type text check (type in ('photo', 'audio', 'document')) not null,
  label text,
  storage_path text not null,
  extracted_text text,
  created_at timestamptz default now()
);

-- Diagnoses table
create table diagnoses (
  id uuid primary key default gen_random_uuid(),
  home_id uuid references homes(id) on delete cascade,
  evidence_ids uuid[] default '{}',
  result jsonb not null,
  created_at timestamptz default now()
);

-- Create storage bucket
insert into storage.buckets (id, name, public)
values ('evidence-files', 'evidence-files', true);

-- Allow public uploads for hackathon (no auth required)
create policy "Allow public uploads" on storage.objects
  for insert with check (bucket_id = 'evidence-files');

create policy "Allow public reads" on storage.objects
  for select using (bucket_id = 'evidence-files');

-- Allow public access to tables for hackathon (no auth)
alter table homes enable row level security;
alter table evidence enable row level security;
alter table diagnoses enable row level security;

create policy "Allow all on homes" on homes for all using (true) with check (true);
create policy "Allow all on evidence" on evidence for all using (true) with check (true);
create policy "Allow all on diagnoses" on diagnoses for all using (true) with check (true);
