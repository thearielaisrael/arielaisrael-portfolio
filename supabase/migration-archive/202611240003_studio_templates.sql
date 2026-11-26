
begin;

create table public.studio_templates (
  id uuid primary key
    default gen_random_uuid(),

  owner_id uuid not null
    references auth.users(id)
    on delete cascade,

  name text not null
    check (
      char_length(btrim(name))
      between 1 and 200
    ),

  description text not null
    default ''
    check (
      char_length(description) <= 1000
    ),

  category text not null
    default ''
    check (
      char_length(category) <= 100
    ),

  document jsonb not null
    check (
      jsonb_typeof(document) = 'object'
    ),

  is_favorite boolean not null
    default false,

  created_at timestamptz not null
    default now(),

  updated_at timestamptz not null
    default now()
);

-- Library lookup indexes.

create index studio_templates_owner_updated_idx
on public.studio_templates (
  owner_id,
  updated_at desc
);

create index studio_templates_owner_category_idx
on public.studio_templates (
  owner_id,
  category
);

create index studio_templates_owner_favorite_idx
on public.studio_templates (
  owner_id,
  is_favorite
);

-- Enable row-level security.

alter table public.studio_templates
enable row level security;

create policy "Studio users can read their templates"
on public.studio_templates
for select
to authenticated
using (auth.uid() = owner_id);

create policy "Studio users can create their templates"
on public.studio_templates
for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "Studio users can update their templates"
on public.studio_templates
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "Studio users can delete their templates"
on public.studio_templates
for delete
to authenticated
using (auth.uid() = owner_id);

-- Restrict anonymous access.

revoke all
on public.studio_templates
from anon;

grant select, insert, update, delete
on public.studio_templates
to authenticated;

commit;
