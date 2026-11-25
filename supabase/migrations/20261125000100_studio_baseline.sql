-- Social Design Studio
-- Checkpoint 28.5B
-- Consolidated database baseline
-- Derived from verified development schema.
-- Schema only; no project or user data.

SET check_function_bodies = false;

CREATE FUNCTION public.save_studio_project(p_id uuid, p_name text, p_document jsonb, p_expected_revision bigint) RETURNS bigint
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
declare
  v_revision bigint;
begin
  update public.studio_projects
  set
    name = p_name,
    document = p_document,
    revision = revision + 1,
    updated_at = now()
  where id = p_id
    and owner_id = (select auth.uid())
    and revision = p_expected_revision
  returning revision into v_revision;

  if v_revision is null then
    raise exception 'STUDIO_REVISION_CONFLICT';
  end if;

  return v_revision;
end;
$$;



CREATE FUNCTION public.update_studio_project_metadata(p_id uuid, p_updates jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
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





CREATE TABLE public.studio_folders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_id uuid NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT studio_folders_name_check CHECK (((char_length(btrim(name)) >= 1) AND (char_length(btrim(name)) <= 100)))
);



CREATE TABLE public.studio_projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_id uuid NOT NULL,
    name text DEFAULT 'Untitled Project'::text NOT NULL,
    document jsonb NOT NULL,
    revision bigint DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    folder_id uuid,
    is_favorite boolean DEFAULT false NOT NULL,
    CONSTRAINT studio_projects_document_object CHECK ((jsonb_typeof(document) = 'object'::text)),
    CONSTRAINT studio_projects_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 200)))
);



CREATE TABLE public.studio_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_id uuid NOT NULL,
    name text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    category text DEFAULT ''::text NOT NULL,
    document jsonb NOT NULL,
    is_favorite boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT studio_templates_category_check CHECK ((char_length(category) <= 100)),
    CONSTRAINT studio_templates_description_check CHECK ((char_length(description) <= 1000)),
    CONSTRAINT studio_templates_document_check CHECK ((jsonb_typeof(document) = 'object'::text)),
    CONSTRAINT studio_templates_name_check CHECK (((char_length(btrim(name)) >= 1) AND (char_length(btrim(name)) <= 200)))
);



ALTER TABLE ONLY public.studio_folders
    ADD CONSTRAINT studio_folders_id_owner_id_key UNIQUE (id, owner_id);



ALTER TABLE ONLY public.studio_folders
    ADD CONSTRAINT studio_folders_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.studio_projects
    ADD CONSTRAINT studio_projects_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.studio_templates
    ADD CONSTRAINT studio_templates_pkey PRIMARY KEY (id);



CREATE UNIQUE INDEX studio_folders_owner_name_idx ON public.studio_folders USING btree (owner_id, lower(btrim(name)));



CREATE INDEX studio_projects_owner_favorite_idx ON public.studio_projects USING btree (owner_id, is_favorite);



CREATE INDEX studio_projects_owner_folder_idx ON public.studio_projects USING btree (owner_id, folder_id);



CREATE INDEX studio_projects_owner_updated_idx ON public.studio_projects USING btree (owner_id, updated_at DESC);



CREATE INDEX studio_templates_owner_category_idx ON public.studio_templates USING btree (owner_id, category);



CREATE INDEX studio_templates_owner_favorite_idx ON public.studio_templates USING btree (owner_id, is_favorite);



CREATE INDEX studio_templates_owner_updated_idx ON public.studio_templates USING btree (owner_id, updated_at DESC);



ALTER TABLE ONLY public.studio_folders
    ADD CONSTRAINT studio_folders_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;



ALTER TABLE ONLY public.studio_projects
    ADD CONSTRAINT studio_projects_folder_owner_fk FOREIGN KEY (folder_id, owner_id) REFERENCES public.studio_folders(id, owner_id) ON DELETE SET NULL (folder_id);



ALTER TABLE ONLY public.studio_projects
    ADD CONSTRAINT studio_projects_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;



ALTER TABLE ONLY public.studio_templates
    ADD CONSTRAINT studio_templates_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;



CREATE POLICY "Owners can create their projects" ON public.studio_projects FOR INSERT TO authenticated WITH CHECK ((owner_id = ( SELECT auth.uid() AS uid)));



CREATE POLICY "Owners can delete their projects" ON public.studio_projects FOR DELETE TO authenticated USING ((owner_id = ( SELECT auth.uid() AS uid)));



CREATE POLICY "Owners can read their projects" ON public.studio_projects FOR SELECT TO authenticated USING ((owner_id = ( SELECT auth.uid() AS uid)));



CREATE POLICY "Owners can update their projects" ON public.studio_projects FOR UPDATE TO authenticated USING ((owner_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((owner_id = ( SELECT auth.uid() AS uid)));



CREATE POLICY "Studio users can create their folders" ON public.studio_folders FOR INSERT TO authenticated WITH CHECK ((auth.uid() = owner_id));



CREATE POLICY "Studio users can create their templates" ON public.studio_templates FOR INSERT TO authenticated WITH CHECK ((auth.uid() = owner_id));



CREATE POLICY "Studio users can delete their folders" ON public.studio_folders FOR DELETE TO authenticated USING ((auth.uid() = owner_id));



CREATE POLICY "Studio users can delete their templates" ON public.studio_templates FOR DELETE TO authenticated USING ((auth.uid() = owner_id));



CREATE POLICY "Studio users can read their folders" ON public.studio_folders FOR SELECT TO authenticated USING ((auth.uid() = owner_id));



CREATE POLICY "Studio users can read their templates" ON public.studio_templates FOR SELECT TO authenticated USING ((auth.uid() = owner_id));



CREATE POLICY "Studio users can update their folders" ON public.studio_folders FOR UPDATE TO authenticated USING ((auth.uid() = owner_id)) WITH CHECK ((auth.uid() = owner_id));



CREATE POLICY "Studio users can update their templates" ON public.studio_templates FOR UPDATE TO authenticated USING ((auth.uid() = owner_id)) WITH CHECK ((auth.uid() = owner_id));



ALTER TABLE public.studio_folders ENABLE ROW LEVEL SECURITY;


ALTER TABLE public.studio_projects ENABLE ROW LEVEL SECURITY;


ALTER TABLE public.studio_templates ENABLE ROW LEVEL SECURITY;

-- Preserve the original Studio-specific privileges.
-- These are tightened by the security migration.

REVOKE ALL ON FUNCTION
  public.save_studio_project(uuid, text, jsonb, bigint)
  FROM PUBLIC, anon, authenticated, service_role;

GRANT EXECUTE ON FUNCTION
  public.save_studio_project(uuid, text, jsonb, bigint)
  TO authenticated, service_role;

REVOKE ALL ON FUNCTION
  public.update_studio_project_metadata(uuid, jsonb)
  FROM PUBLIC, anon, authenticated, service_role;

GRANT EXECUTE ON FUNCTION
  public.update_studio_project_metadata(uuid, jsonb)
  TO authenticated, service_role;

GRANT ALL ON TABLE public.studio_projects
  TO anon, authenticated, service_role;

GRANT ALL ON TABLE public.studio_folders
  TO anon, authenticated, service_role;

REVOKE ALL ON TABLE public.studio_templates
  FROM PUBLIC, anon;

GRANT ALL ON TABLE public.studio_templates
  TO authenticated, service_role;

RESET check_function_bodies;
