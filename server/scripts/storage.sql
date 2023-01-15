INSERT INTO storage.buckets (id, name)
VALUES ('documents_uploads', 'documents_uploads');

DROP POLICY IF EXISTS "Users can access the files of the documents they have access to." ON storage.objects;
CREATE POLICY "Users can access the files of the documents they have access to."
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents_uploads' AND
    get_user_permission_for_document((storage.foldername(name))[1]::uuid, auth.uid(), null) IN ('read', 'edit')
  );

DROP POLICY IF EXISTS "Users can upload files." ON storage.objects;
CREATE POLICY "Users can upload files."
  ON storage.objects FOR INSERT
  WITH CHECK ( 
    bucket_id = 'documents_uploads'
  );
