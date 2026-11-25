
-- Social Design Studio
-- Checkpoint 28.5B
-- Private Alpha security hardening

-- ============================================================
-- 1. Private database authorization
-- ============================================================

create schema studio_private;

revoke all on schema studio_private
from public, anon, authenticated;

grant usage on schema studio_private
to authenticated;

create table studio_private.allowed_users (
  user_id uuid primary key
    references auth.users(id)
    on delete cascade,

  created_at timestamptz
    not null default now()
);

alter table studio_private.allowed_users
enable row level security;

revoke all on table studio_private.allowed_users
from public, anon, authenticated;

create function studio_private.is_allowed_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from studio_private.allowed_users
    where user_id = auth.uid()
  );
$$;

revoke all on function
  studio_private.is_allowed_user()
from public, anon, authenticated;

grant execute on function
  studio_private.is_allowed_user()
to authenticated;

-- ============================================================
-- 2. Restrictive authorization policies
-- ============================================================

create policy "Studio authorized account required"
on public.studio_projects
as restrictive
for all
to authenticated
using (
  (select studio_private.is_allowed_user())
)
with check (
  (select studio_private.is_allowed_user())
);

create policy "Studio authorized account required"
on public.studio_folders
as restrictive
for all
to authenticated
using (
  (select studio_private.is_allowed_user())
)
with check (
  (select studio_private.is_allowed_user())
);

create policy "Studio authorized account required"
on public.studio_templates
as restrictive
for all
to authenticated
using (
  (select studio_private.is_allowed_user())
)
with check (
  (select studio_private.is_allowed_user())
);

-- ============================================================
-- 3. Explicit minimum table privileges
-- ============================================================

revoke all on table
  public.studio_projects,
  public.studio_folders,
  public.studio_templates
from public, anon, authenticated;

-- Projects are created, read and deleted through
-- existing API routes. Updates use controlled RPCs.

grant select, insert, delete
on table public.studio_projects
to authenticated;

-- Folders and templates retain their existing
-- CRUD workflows, protected by both RLS policies.

grant select, insert, update, delete
on table
  public.studio_folders,
  public.studio_templates
to authenticated;

-- ============================================================
-- 4. Revision-controlled project saving
-- ============================================================

create or replace function public.save_studio_project(
  p_id uuid,
  p_name text,
  p_document jsonb,
  p_expected_revision bigint
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_revision bigint;
begin

  if v_user_id is null
    or not studio_private.is_allowed_user()
  then
    raise exception 'STUDIO_UNAUTHORIZED';
  end if;

  update public.studio_projects
  set
    name = p_name,
    document = p_document,
    revision = revision + 1,
    updated_at = now()
  where id = p_id
    and owner_id = v_user_id
    and revision = p_expected_revision
  returning revision into v_revision;

  if v_revision is null then
    raise exception 'STUDIO_REVISION_CONFLICT';
  end if;

  return v_revision;
end;
$$;

-- ============================================================
-- 5. Controlled organizational metadata updates
-- ============================================================

create or replace function
public.update_studio_project_metadata(
  p_id uuid,
  p_updates jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_folder_id uuid;
  v_favorite boolean;
  v_result jsonb;
begin

  if v_user_id is null
    or not studio_private.is_allowed_user()
  then
    raise exception 'STUDIO_UNAUTHORIZED';
  end if;

  if p_updates is null
    or jsonb_typeof(p_updates) <> 'object'
    or p_updates = '{}'::jsonb
  then
    raise exception 'STUDIO_INVALID_METADATA';
  end if;

  if (
    p_updates - 'folder_id' - 'is_favorite'
  ) <> '{}'::jsonb then
    raise exception 'STUDIO_INVALID_METADATA';
  end if;

  if p_updates ? 'is_favorite' then

    if jsonb_typeof(
      p_updates -> 'is_favorite'
    ) <> 'boolean' then
      raise exception 'STUDIO_INVALID_FAVORITE';
    end if;

    v_favorite :=
      (p_updates ->> 'is_favorite')::boolean;

  end if;

  if p_updates ? 'folder_id' then

    if p_updates -> 'folder_id' = 'null'::jsonb then

      v_folder_id := null;

    elsif jsonb_typeof(
      p_updates -> 'folder_id'
    ) = 'string' then

      v_folder_id :=
        (p_updates ->> 'folder_id')::uuid;

      if not exists (
        select 1
        from public.studio_folders
        where id = v_folder_id
          and owner_id = v_user_id
      ) then
        raise exception 'STUDIO_FOLDER_NOT_FOUND';
      end if;

    else

      raise exception 'STUDIO_INVALID_FOLDER';

    end if;

  end if;

  update public.studio_projects as project
  set
    folder_id = case
      when p_updates ? 'folder_id'
        then v_folder_id
      else project.folder_id
    end,

    is_favorite = case
      when p_updates ? 'is_favorite'
        then v_favorite
      else project.is_favorite
    end

  where project.id = p_id
    and project.owner_id = v_user_id

  returning jsonb_build_object(
    'id', project.id,
    'name', project.name,
    'revision', project.revision,
    'updated_at', project.updated_at,
    'created_at', project.created_at,
    'folder_id', project.folder_id,
    'is_favorite', project.is_favorite
  )
  into v_result;

  if not found then
    raise exception 'STUDIO_PROJECT_NOT_FOUND';
  end if;

  return v_result;

end;
$$;

-- ============================================================
-- 6. Explicit RPC execution privileges
-- ============================================================

revoke all on function
  public.save_studio_project(
    uuid, text, jsonb, bigint
  )
from public, anon, authenticated, service_role;

grant execute on function
  public.save_studio_project(
    uuid, text, jsonb, bigint
  )
to authenticated;

revoke all on function
  public.update_studio_project_metadata(
    uuid, jsonb
  )
from public, anon, authenticated, service_role;

grant execute on function
  public.update_studio_project_metadata(
    uuid, jsonb
  )
to authenticated;
