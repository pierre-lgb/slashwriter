-- +------------------------------------------+
-- |                 PROFILES                 |
-- +------------------------------------------+
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Trigger on auth user created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  folder_id uuid;
begin
  insert into profiles (id, username, email)
    values (new.id, split_part(new.email, '@', 1), new.email);
  
  insert into folders (user_id, name)
    values (new.id, 'Bienvenue');

  select folders.id into folder_id from folders where user_id=new.id;
  
  insert into documents (user_id, folder, title, state)
    values (new.id, folder_id, 'Bienvenue sur Slashwriter', getWelcomeDocumentState());
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger on auth user deleted
create or replace function public.handle_delete_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  delete from profiles where id = old.id;
  delete from shares where user_id = old.id;
  delete from documents where user_id = old.id;
  delete from folders where user_id = old.id;
  return old;
end;
$$;

drop trigger if exists on_auth_user_deleted on auth.users;
create trigger on_auth_user_deleted
  before delete on auth.users
  for each row execute procedure public.handle_delete_user();

-- Trigger on auth user updated
create or replace function public.handle_update_user() 
returns trigger 
language plpgsql 
security definer set search_path = public
as $$
begin
  update profiles
  set email = new.email
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update of email on auth.users
  for each row execute procedure public.handle_update_user();


-- +------------------------------------------+
-- |                  FOLDERS                 |
-- +------------------------------------------+

-- Trigger on folder moved to trash (temporary delete)
create or replace function public.handle_temp_delete_folder()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.deleted = true then
    new.deleted_at := timezone('utc'::text, now());
    update documents 
    set deleted_at = timezone('utc'::text, now()), deleted = true
    where folder = new.id and deleted = false;
  else
    new.deleted_at := null;
    update documents
    set deleted_at = null, deleted = false
    where folder = new.id and deleted_at = old.deleted_at;
  end if;

  return new;
end;
$$;

drop trigger if exists on_temp_delete_folder on folders;
create trigger on_temp_delete_folder
  before update of deleted on folders
  for each row execute procedure public.handle_temp_delete_folder();


-- +------------------------------------------+
-- |                  SHARES                  |
-- +------------------------------------------+
-- Trigger on share settings inserted or updated
create or replace function public.handle_upsert_share()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.include_subdocuments = true then
    update documents
    set share_settings = new.id
    where id = new.document_id or path like ('%' || new.document_id::text || '%') and share_settings is null;
  else
    update documents
    set share_settings = new.id
    where id = new.document_id;

    update documents
    set share_settings = null
    where path like ('%' || new.document_id::text || '%') and share_settings = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_insert_share on shares;
create trigger on_insert_share
  after insert on shares
  for each row execute procedure public.handle_upsert_share();

drop trigger if exists on_update_share on shares;
create trigger on_update_share
  after update of document_id, include_subdocuments on shares
  for each row execute procedure public.handle_upsert_share();



-- Trigger on share settings deleted
create or replace function public.handle_delete_share()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update documents
  set share_settings = null
  where share_settings = old.id;
  return old;
end;
$$;

drop trigger if exists on_delete_share on shares;
create trigger on_delete_share
  before delete on shares
  for each row execute procedure public.handle_delete_share();

-- +------------------------------------------+
-- |                 DOCUMENTS                |
-- +------------------------------------------+
-- Trigger on document inserted
create or replace function public.handle_insert_document()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.parent is not null then
    new.folder := (SELECT at.folder FROM documents at WHERE at.id = new.parent);
    new.user_id := (SELECT at.user_id FROM documents at WHERE at.id = new.parent);
    new.path := (SELECT at.path FROM documents at WHERE at.id = new.parent)::citext || new.parent::citext || '/';
    new.share_settings := (SELECT at.share_settings FROM documents at WHERE at.id = new.parent)::uuid;
    if not (SELECT at.include_subdocuments FROM shares at WHERE at.id = new.share_settings) then
      new.share_settings := null;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists on_insert_document on documents;
create trigger on_insert_document
  before insert on documents
  for each row execute procedure public.handle_insert_document();

  -- Trigger on document share_settings updated
create or replace function public.handle_update_document_share_settings()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if (
    new.share_settings is not null and 
    (SELECT at.include_subdocuments FROM shares at WHERE at.id = new.share_settings) is not null
  ) then
    update documents
    set share_settings = new.share_settings
    where path like ('%' || new.id::text || '%') and share_settings = old.share_settings;
  else
    update documents
    set share_settings = null
    where path like ('%' || new.id::text || '%') and share_settings = old.share_settings;
  end if;
  return new;
end;
$$;

drop trigger if exists on_update_document_share_settings on documents;
create trigger on_update_document_share_settings
  before update of share_settings on documents
  for each row when (pg_trigger_depth() < 1)
  execute procedure public.handle_update_document_share_settings();



-- Trigger on document moved to trash (temporary delete)
create or replace function public.handle_temp_delete_document()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.deleted = true then
    new.deleted_at := timezone('utc'::text, now());
    update documents 
    set deleted_at = timezone('utc'::text, now()), deleted = true
    where path like ('%' || new.id::text || '%') and deleted = false;
  else
    new.deleted_at := null;
    update documents
    set deleted_at = null, deleted = false
    where path like ('%' || new.id::text || '%') and deleted_at = old.deleted_at;
  end if;

  return new;
end;
$$;

drop trigger if exists on_temp_delete_document on documents;
create trigger on_temp_delete_document
  before update of deleted on documents
  for each row when (pg_trigger_depth() < 1)
  execute procedure public.handle_temp_delete_document();


-- Trigger on document updated
create or replace function public.handle_update_document()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at := timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists on_update_document on documents;
create trigger on_update_document
  before update of state on documents
  for each row execute procedure public.handle_update_document();