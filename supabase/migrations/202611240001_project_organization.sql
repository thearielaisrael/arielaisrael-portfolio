
begin;

-- ============================================================
-- Studio 28.2
-- Project organization
-- ============================================================

create table if not exists public.studio_folders (
  id uuid primary key default gen_random_uuid(),

  owner_id uuid not null
    references auth.users(id)
    on delete cascade,

  name text not null
    check (
      char_length(btrim(name)) between 1 and 100
    ),

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  unique (id, owner_id)
);

create unique index if not exists studio_folders_owner_name_idx
  on public.studio_folders (
    owner_id,
    lower(btrim(name))
  );

alter table public.studio_projects
  add column if not exists folder_id uuid;

alter table public.studio_projects
  add column if not exists is_favorite boolean
  not null default false;

alter table public.studio_projects
  add column if not exists created_at timestamptz;

-- Existing projects receive their last known modification date
-- as an approximate creation date if none was recorded.

update public.studio_projects
set created_at = coalesce(updated_at, now())
where created_at is null;

alter table public.studio_projects
  alter column created_at set default now();

alter table public.studio_projects
  alter column created_at set not null;

-- Prevent assigning a project to another user's folder.

alter table public.studio_projects
  add constraint studio_projects_folder_owner_fk
  foreign key (folder_id, owner_id)
  references public.studio_folders (id, owner_id)
  on delete set null (folder_id);

create index if not exists studio_projects_owner_folder_idx
  on public.studio_projects (owner_id, folder_id);

create index if not exists studio_projects_owner_favorite_idx
  on public.studio_projects (owner_id, is_favorite);

-- ============================================================
-- Folder security
-- ============================================================

alter table public.studio_folders
  enable row level security;

create policy "Studio users can read their folders"
on public.studio_folders
for select
to authenticated
using (auth.uid() = owner_id);

create policy "Studio users can create their folders"
on public.studio_folders
for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "Studio users can update their folders"
on public.studio_folders
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "Studio users can delete their folders"
on public.studio_folders
for delete
to authenticated
using (auth.uid() = owner_id);

grant select, insert, update, delete
on public.studio_folders
to authenticated;

commit;
