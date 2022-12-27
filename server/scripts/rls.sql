-- +------------------------------------------+
-- |                 PROFILES                 |
-- +------------------------------------------+
alter table profiles enable row level security;

drop policy if exists "Profiles are viewable by everyone" on profiles;
create policy "Profiles are viewable by everyone" on profiles
  for select using (true);

drop policy if exists "Users can insert their own profile" on profiles;
create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);


-- +------------------------------------------+
-- |                  FOLDERS                 |
-- +------------------------------------------+
alter table folders enable row level security;

drop policy if exists "Users can create folders" on folders;
create policy "Users can create folders" on folders
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can view their own folders" on folders;
create policy "Users can view their own folders" on folders
  for select using (auth.uid() = user_id);

drop policy if exists "Users can update their own folders" on folders;
create policy "Users can update their own folders" on folders
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their own folders" on folders;
create policy "Users can delete their own folders" on folders
  for delete using (auth.uid() = user_id);


-- +------------------------------------------+
-- |                  SHARES                  |
-- +------------------------------------------+
alter table shares enable row level security;

drop policy if exists "Users can create shares" on shares;
create policy "Users can create shares" on shares
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own shares" on shares;
create policy "Users can update their own shares" on shares
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their own shares" on shares;
create policy "Users can delete their own shares" on shares
  for delete using (auth.uid() = user_id);


-- +------------------------------------------+
-- |                 DOCUMENTS                |
-- +------------------------------------------+
alter table documents enable row level security;

drop policy if exists "Users can create documents" on documents;
create policy "Users can create documents" on documents
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own documents" on documents;
create policy "Users can delete their own documents" on documents
  for delete using (auth.uid() = user_id);

drop policy if exists "Document read permission policy" on documents;
create policy "Document read permission policy" on documents
  for select using (canReadDocument(auth.uid(), documents.id, documents));

drop policy if exists "Document edit permission policy" on documents;
create policy "Document edit permission policy" on documents
  for select using (canEditDocument(auth.uid(), documents.id, documents));

drop policy if exists "Other users may insert subdocuments in a shared document" on documents;
create policy "Other users may insert subdocuments in a shared document" on documents
  for insert with check (
    parent is not null and
    canInsertSubdocument(auth.uid(), parent)
  ); 





-- +------------------------------------------+
-- |                  STORAGE                 |
-- +------------------------------------------+

drop policy if exists "Users can access the files of the documents they have access to." on storage.objects;
create policy "Users can access the files of the documents they have access to."
  on storage.objects for select
  using (
    bucket_id = 'documents_uploads' and
    canReadDocument(auth.uid(), (storage.foldername(name))[1]::uuid)
  );

drop policy if exists "Users can upload files." on storage.objects;
create policy "Users can upload files."
  on storage.objects for insert
  with check ( 
    bucket_id = 'documents_uploads'
  );