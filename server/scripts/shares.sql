-- +------------------------------------------+
-- |                  SHARES                  |
-- +------------------------------------------+

ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Shares INSERT policy" ON shares;
CREATE POLICY "Shares INSERT policy" ON shares
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1
      FROM documents
      WHERE documents.id = shares.document_id
        AND documents.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Shares SELECT policy" ON shares;
CREATE POLICY "Shares SELECT policy" ON shares
  FOR SELECT USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Shares UPDATE policy" ON shares;
CREATE POLICY "Shares UPDATE policy" ON shares
  FOR UPDATE USING (
    EXISTS (
      SELECT 1
      FROM documents
      WHERE documents.id = shares.document_id
        AND documents.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Shares DELETE policy" ON shares;
CREATE POLICY "Shares DELETE policy" ON shares
  FOR DELETE USING (auth.uid() = owner_id);


-- When a `share` is created, set the share_settings column of the document with
-- the id `share.document_id` and its subdocuments.
CREATE OR REPLACE FUNCTION update_documents_on_share_create_or_delete()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
    WITH recursive subdocuments AS (
        SELECT id FROM documents WHERE id = (
            CASE TG_OP
                WHEN 'DELETE' THEN OLD.document_id
                ELSE NEW.document_id
            END
        )
        UNION ALL
        SELECT d.id FROM subdocuments s
        JOIN documents d ON s.id = d.parent_id
    )
    UPDATE documents SET share_settings = 
        CASE 
            WHEN TG_OP = 'INSERT' THEN NEW.id
            WHEN TG_OP = 'DELETE' THEN NULL
        END
    FROM subdocuments 
    WHERE documents.id = subdocuments.id 
    AND (TG_OP = 'INSERT' OR (TG_OP = 'DELETE' AND documents.share_settings = OLD.id));

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_documents_on_share_create_or_delete on shares;
CREATE TRIGGER update_documents_on_share_create_or_delete
    AFTER INSERT OR DELETE ON shares
    FOR EACH ROW
    EXECUTE FUNCTION update_documents_on_share_create_or_delete();