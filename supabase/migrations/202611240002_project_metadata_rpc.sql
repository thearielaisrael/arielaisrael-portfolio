
begin;

create or replace function public.update_studio_project_metadata(
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

  -- Require an authenticated user.

  if v_user_id is null then
    raise exception 'STUDIO_UNAUTHORIZED';
  end if;

  -- Validate the metadata payload.

  if p_updates is null
    or jsonb_typeof(p_updates) <> 'object'
    or p_updates = '{}'::jsonb
  then
    raise exception 'STUDIO_INVALID_METADATA';
  end if;

  -- Reject unsupported fields.
  -- Design documents and revisions cannot be changed here.

  if (
    p_updates - 'folder_id' - 'is_favorite'
  ) <> '{}'::jsonb then
    raise exception 'STUDIO_INVALID_METADATA';
  end if;

  -- Validate favorite status.

  if p_updates ? 'is_favorite' then

    if jsonb_typeof(
      p_updates -> 'is_favorite'
    ) <> 'boolean' then
      raise exception 'STUDIO_INVALID_FAVORITE';
    end if;

    v_favorite :=
      (p_updates ->> 'is_favorite')::boolean;

  end if;

  -- Validate destination folder and its ownership.

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

  -- Modify only organizational metadata.
  -- Do not overwrite the design document or revision.

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

-- Restrict function execution.

revoke all
on function public.update_studio_project_metadata(
  uuid,
  jsonb
)
from public, anon, authenticated;

grant execute
on function public.update_studio_project_metadata(
  uuid,
  jsonb
)
to authenticated;

commit;
