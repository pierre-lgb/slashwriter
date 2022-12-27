-- +------------------------------------------+
-- |             canReadDocument()            |
-- +------------------------------------------+

create or replace function canReadDocument(user_id uuid, document_id uuid, document documents) returns boolean
language plpgsql security definer
as
$$
declare
  document_owner_id uuid;
  document_deleted boolean;
  share_id uuid;
  share_settings shares%rowtype;
begin
if document is null then
  select documents.user_id into document_owner_id from documents where id=document_id;

  -- Document does not exist.
  if not found then
    raise exception 'NOT_FOUND';
    return false;
  end if;

  select documents.share_settings into share_id from documents where id=document_id;
  select documents.deleted into document_deleted from documents where id=document_id;
else
  document_owner_id := document.user_id;
  share_id := document.share_settings;
  document_deleted := document.deleted;
end if;

-- Document owner can read its own document.
if (user_id=document_owner_id) then
  return true;
end if;

if share_id is null then
  raise exception 'NOT_ALLOWED';
  return false;
end if;

select * into share_settings from shares where id=share_id;

-- Other users cannot read deleted documents.
if (document_deleted) then
  raise exception 'DOCUMENT_DELETED';
  return false;
end if;

-- Other users can read the document if share_settings allows it.
if (
  share_settings.anyone_can_read or
  user_id = any(share_settings.users_can_read) or
  share_settings.anyone_can_edit or
  user_id = any(share_settings.users_can_edit)
) then
  return true;
end if;

-- If none of the conditions are met, the user does not have read access.
raise exception 'NOT_ALLOWED';
return false;
end; $$;




-- +------------------------------------------+
-- |             canEditDocument()            |
-- +------------------------------------------+

create or replace function canEditDocument(user_id uuid, document_id uuid, document documents) returns boolean
language plpgsql security definer
as
$$
declare
  document_owner_id uuid;
  document_deleted boolean;
  share_id uuid;
  share_settings shares%rowtype;
begin
if document is null then
  select documents.user_id into document_owner_id from documents where id=document_id;

  -- Document does not exist.
  if not found then
    raise exception 'NOT_FOUND';
    return false;
  end if;

  select documents.share_settings into share_id from documents where id=document_id;
  select documents.deleted into document_deleted from documents where id=document_id;
else
  document_owner_id := document.user_id;
  share_id := document.share_settings;
  document_deleted := document.deleted;
end if;

-- Document owner can edit its own document.
if (user_id=document_owner_id) then
  return true;
end if;

if share_id is null then
  raise exception 'NOT_ALLOWED';
  return false;
end if;

select * into share_settings from shares where id=share_id;

-- Other users cannot edit deleted documents.
if (document_deleted) then
  raise exception 'DOCUMENT_DELETED';
  return false;
end if;

-- Other users can edit the document if share_settings allows it.
if (
  share_settings.anyone_can_edit or
  user_id = any(share_settings.users_can_edit)
) then
  return true;
end if;

-- If none of the conditions are met, the user does not have edit access.
raise exception 'NOT_ALLOWED';
return false;
end; $$;




-- +------------------------------------------+
-- |          canInsertSubdocument()          |
-- +------------------------------------------+

create or replace function canInsertSubdocument(user_id uuid, parent_document_id uuid) returns boolean
language plpgsql
as
$$
declare
  parent_document documents%rowtype;
  parent_share_settings shares%rowtype;
  share_id uuid;
  include_subdocuments boolean;
begin
select * into parent_document from documents where id=parent_document_id;
if not found then
  return false;
end if;

select documents.share_settings into share_id from documents where id=parent_document_id;

if share_id is null then
  return false;
end if;

select shares.include_subdocuments into include_subdocuments from shares where id=share_id;

if include_subdocuments is true and canEditDocument(user_id, parent_document_id) then
  return true;
else
  return false;
end if;
end; $$;