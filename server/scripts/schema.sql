-- +------------------------------------------+
-- |                 PROFILES                 |
-- +------------------------------------------+
create table if not exists profiles (
  id uuid references auth.users not null,
  username text unique not null,
  email text unique not null,
  avatar_url text,

  primary key (id),
  unique(username),
  constraint username_length check (char_length(username) >= 3)
);


-- +------------------------------------------+
-- |                  FOLDERS                 |
-- +------------------------------------------+
create table if not exists folders (
  id uuid default uuid_generate_v4() not null,
  user_id uuid references auth.users default uid() not null,
  name text default 'Folder' not null,
  color text default '#8F95B2' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  deleted_at timestamp with time zone,
  deleted boolean default false not null,

  primary key (id),
  constraint name_length check (char_length(name) >= 3),
  constraint color_hex_format check (color ~ '^#[a-zA-Z0-9]{6}$')
);

-- +------------------------------------------+
-- |                  SHARES                  |
-- +------------------------------------------+
create table if not exists shares (
  id uuid default uuid_generate_v4() not null,
  user_id uuid references auth.users default uid() not null,
  document_id uuid not null unique,
  include_subdocuments boolean default true not null,
  anyone_can_read boolean default false not null,
  anyone_can_edit boolean default false not null,
  users_can_read uuid[],
  users_can_edit uuid[],

  primary key (id)
);


-- +------------------------------------------+
-- |                 DOCUMENTS                |
-- +------------------------------------------+
create table if not exists documents (
  id uuid default uuid_generate_v4() not null,
  user_id uuid references auth.users default uid() not null,
  folder uuid references folders not null,
  path text default '/'not null,
  parent uuid references documents ON DELETE CASCADE,
  title text,
  previous_titles text[],
  text text,
  state bytea,
  share_settings uuid references shares,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  deleted_at timestamp with time zone,
  deleted boolean default false not null,
  favorite boolean default false not null,

  primary key (id),
  constraint path_of_uuid check (path ~ '^\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/)*$')
);

alter table shares
  add foreign key (document_id) references documents (id)
  deferrable initially deferred;

DROP VIEW documents_shared_with_user;
CREATE VIEW documents_shared_with_user AS
SELECT * from (
    SELECT 
        d.id,
        d.title,
        (CASE
            WHEN uid() = ANY(s.users_can_edit) THEN 'read|edit'
            WHEN uid() = ANY(s.users_can_read) THEN 'read'
            ELSE NULL
        END) AS permission, 
        p.id as owner_id,
        p.username as owner_username,
        p.email as owner_email
    FROM documents d
    JOIN shares s ON s.id = d.share_settings
    INNER JOIN profiles p ON p.id = d.user_id
    WHERE s.document_id = d.id
) AS t 
WHERE permission IS NOT NULL;

DROP VIEW documents_shared_by_user;
CREATE OR REPLACE VIEW documents_shared_by_user AS
    SELECT 
        d.id,
        d.title,
        d.folder,
        s.include_subdocuments,
        (s.anyone_can_read OR s.anyone_can_edit) AS public
    FROM documents d
    JOIN shares s ON s.id = d.share_settings
    WHERE d.user_id = uid() AND s.document_id = d.id