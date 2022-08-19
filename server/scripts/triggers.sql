-- +------------------------------------------+
-- |                 PROFILES                 |
-- +------------------------------------------+
-- Trigger on auth user created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into profiles (id, username, email)
    values (new.id, split_part(new.email, '@', 1), new.email);
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
-- Trigger on folder inserted
-- create or replace function public.handle_insert_folder()
-- returns trigger
-- language plpgsql
-- security definer set search_path = public
-- as $$
-- begin
--   return new;
-- end;
-- $$;

-- drop trigger if exists on_insert_folder on folders;
-- create trigger on_insert_folder
--   before insert on folders
--   for each row execute procedure public.handle_insert_folder();


-- +------------------------------------------+
-- |                  SHARES                  |
-- +------------------------------------------+


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
    new.path := (SELECT at.path FROM documents at where at.id = new.parent)::citext || new.parent::citext || '/';
  end if;
  return new;
end;
$$;

drop trigger if exists on_insert_document on documents;
create trigger on_insert_document
  before insert on documents
  for each row execute procedure public.handle_insert_document();


-- Trigger on document updated
create or replace function public.handle_update_document()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at := timezone('utc'::text, now());
  if new.deleted_at is distinct from old.deleted_at then
    update documents
    set deleted_at = new.deleted_at
    where path like ('%' || new.id::text || '%');
  end if;
  return new;
end;
$$;

drop trigger if exists on_update_document on documents;
create trigger on_update_document
  before update on documents
  for each row execute procedure public.handle_update_document();



-- Trigger on document deleted
create or replace function public.handle_delete_document()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  delete from documents
  where path like ('%' || old.id::text || '%');
  return old;
end;
$$;

drop trigger if exists on_delete_document on documents;
create trigger on_delete_document
  before delete on documents
  for each row execute procedure public.handle_delete_document();