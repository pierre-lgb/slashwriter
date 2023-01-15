-- +------------------------------------------+
-- |                  SHARES                  |
-- +------------------------------------------+
CREATE TABLE IF NOT EXISTS shares (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    owner_id UUID REFERENCES auth.users DEFAULT uid() NOT NULL,
    document_id UUID REFERENCES documents(id) NOT NULL UNIQUE,
    anyone_permission VARCHAR(10),
    user_permissions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add foreign key to `share_settings` column in `documents` table
ALTER TABLE documents
    DROP CONSTRAINT IF EXISTS documents_share_settings_fkey;
ALTER TABLE documents
    ADD CONSTRAINT documents_share_settings_fkey
    FOREIGN KEY (share_settings) REFERENCES shares (id)
    DEFERRABLE INITIALLY DEFERRED;

--     SELECT conname, confrelid::regclass, conrelid::regclass
-- FROM pg_constraint
-- WHERE conrelid = 'documents'::regclass AND confrelid = 'shares'::regclass;



-- Row level security
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Shares INSERT policy" ON shares;
CREATE POLICY "Shares INSERT policy" ON shares
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Shares SELECT policy" ON shares;
CREATE POLICY "Shares SELECT policy" ON shares
  FOR SELECT USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Shares UPDATE policy" ON shares;
CREATE POLICY "Shares UPDATE policy" ON shares
  FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Shares DELETE policy" ON shares;
CREATE POLICY "Shares DELETE policy" ON shares
  FOR DELETE USING (auth.uid() = owner_id);



CREATE OR REPLACE FUNCTION update_documents_on_share_create_or_delete()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
    -- update the share_settings column for the current document and its subdocuments
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

DROP TRIGGER update_documents_on_share_create_or_delete on shares;
CREATE TRIGGER update_documents_on_share_create_or_delete
    AFTER INSERT OR DELETE ON shares
    FOR EACH ROW
    EXECUTE FUNCTION update_documents_on_share_create_or_delete();