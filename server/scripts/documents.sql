-- +------------------------------------------+
-- |                 DOCUMENTS                |
-- +------------------------------------------+

DROP VIEW IF EXISTS user_documents_tree;
CREATE VIEW user_documents_tree
WITH (security_invoker) 
as SELECT id, title, folder_id, parent_id, favorite, updated_at
FROM documents
WHERE owner_id = auth.uid() AND NOT deleted
ORDER BY updated_at desc;


DROP VIEW IF EXISTS documents_shared_with_user;
CREATE VIEW documents_shared_with_user
WITH (security_invoker)
as SELECT * from (
    SELECT 
        d.id,
        d.title,
        d.text_preview,
        (CASE 
            WHEN s.user_permissions ? auth.uid()::text THEN 
                s.user_permissions->>auth.uid()::text
            ELSE 
                NULL
        END) AS permission,
        p.id as owner_id,
        p.username as owner_username,
        p.email as owner_email
    FROM documents d
    JOIN shares s ON s.id = d.share_settings
    INNER JOIN profiles p ON p.id = d.owner_id
    WHERE s.document_id = d.id
) AS t 
WHERE permission IS NOT NULL;

DROP VIEW IF EXISTS documents_shared_by_user;
CREATE OR REPLACE VIEW documents_shared_by_user
WITH (security_invoker)
as SELECT 
        d.id,
        d.title,
        d.text_preview,
        d.folder_id,
        (s.anyone_permission IN ('read', 'edit') OR FALSE) AS public,
        s.created_at AS share_created_at
    FROM documents d
    JOIN shares s ON s.id = d.share_settings
    WHERE d.owner_id = auth.uid() AND s.document_id = d.id;

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Documents INSERT policy" ON documents;
CREATE POLICY "Documents INSERT policy" ON documents
    FOR INSERT WITH CHECK (
        auth.uid() = owner_id OR
        (
            parent_id IS NOT NULL AND 
            get_user_permission_for_document(parent_id, auth.uid(), null) = 'edit'
        )
    );

DROP POLICY IF EXISTS "Documents SELECT policy" ON documents;
CREATE POLICY "Documents SELECT policy" ON documents
    FOR SELECT USING (
        get_user_permission_for_document(documents.id, auth.uid(), documents) IN ('edit', 'read')
    );

DROP POLICY IF EXISTS "Documents UPDATE policy" ON documents;
CREATE POLICY "Documents UPDATE policy" ON documents
    FOR UPDATE USING (
        get_user_permission_for_document(documents.id, auth.uid(), documents) = 'edit'
    );

DROP POLICY IF EXISTS "Documents DELETE policy" ON documents;
CREATE POLICY "Documents DELETE policy" ON documents
    FOR DELETE USING (
        auth.uid() = owner_id
    );




-- Trigger on document inserted
CREATE OR REPLACE FUNCTION handle_insert_document()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    -- When a subdocument is inserted, in inherits some props from its parent
    IF NEW.parent_id IS NOT NULL THEN
        IF NEW.folder_id IS NULL THEN 
            NEW.folder_id := (SELECT d.folder_id FROM documents d WHERE d.id = NEW.parent_id);
        END IF;
        IF NEW.owner_id IS NULL THEN 
            NEW.owner_id := (SELECT d.owner_id FROM documents d WHERE d.id = NEW.parent_id);
        END IF;
        IF NEW.share_settings IS NULL THEN 
            NEW.share_settings := (SELECT d.share_settings FROM documents d WHERE d.id = NEW.parent_id);
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_insert_document ON documents;
CREATE TRIGGER on_insert_document
    BEFORE INSERT ON documents
    FOR EACH ROW
    EXECUTE PROCEDURE handle_insert_document();



-- Trigger on document updated
CREATE OR REPLACE FUNCTION handle_update_document()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  NEW.updated_at := timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_update_document ON documents;
CREATE TRIGGER on_update_document
  BEFORE UPDATE OF state ON documents
  FOR EACH ROW
  EXECUTE PROCEDURE handle_update_document();


-- Whenever a document is temporarily deleted (`deleted` column set to true), 
-- temporarily delete all the and subdocuments as well.
CREATE OR REPLACE FUNCTION update_subdocuments_on_temp_delete_document()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
    -- update deleted_at for the current document
    UPDATE documents SET deleted_at = (CASE WHEN NEW.deleted THEN NOW() ELSE NULL END) WHERE id = NEW.id;

    -- update deleted and deleted_at for all subdocuments
    WITH recursive subdocuments AS (
        SELECT id FROM documents WHERE id = NEW.id
        UNION ALL
        SELECT d.id FROM subdocuments s
        JOIN documents d ON s.id = d.parent_id
    )
    UPDATE documents SET deleted = NEW.deleted, deleted_at = (CASE WHEN NEW.deleted THEN NOW() ELSE NULL END) FROM subdocuments WHERE documents.id = subdocuments.id;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_subdocuments_on_temp_delete_document ON documents;
CREATE TRIGGER update_subdocuments_on_temp_delete_document
    AFTER UPDATE OF deleted ON documents
    FOR EACH ROW WHEN (pg_trigger_depth() < 1)
    EXECUTE PROCEDURE update_subdocuments_on_temp_delete_document();


-- Log documents updates in the "realtime_updates" table
CREATE OR REPLACE FUNCTION log_document_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO realtime_events (user_id, event_type, data)
        VALUES (
            CASE
                WHEN TG_OP = 'DELETE' THEN 
                    OLD.owner_id
                ELSE 
                    NEW.owner_id
            END,
            'document.' || (CASE
                WHEN TG_OP = 'DELETE' OR NEW.deleted IS TRUE THEN
                    'DELETE'
                WHEN OLD.deleted IS TRUE AND NEW.deleted IS FALSE THEN
                    'INSERT'
                ELSE
                    TG_OP
            END),
            CASE
                WHEN TG_OP = 'DELETE' THEN
                    jsonb_build_object(
                        'id', OLD.id
                    )
                ELSE
                    jsonb_build_object(
                        'id', NEW.id,
                        'title', NEW.title,
                        'folder_id', NEW.folder_id,
                        'parent_id', NEW.parent_id,
                        'favorite', NEW.favorite,
                        'updated_at', NEW.updated_at
                    )
            END
        );
    RETURN NEW;
END
$$;

DROP TRIGGER IF EXISTS handle_document_insert ON documents;
CREATE TRIGGER handle_document_insert
    AFTER INSERT ON documents
    FOR EACH ROW
    EXECUTE FUNCTION log_document_update();

DROP TRIGGER IF EXISTS handle_document_update ON documents;
CREATE TRIGGER handle_document_update
    AFTER UPDATE OF title, favorite ON documents
    FOR EACH ROW
    EXECUTE FUNCTION log_document_update();

DROP TRIGGER IF EXISTS handle_document_delete ON documents;
CREATE TRIGGER handle_document_delete
    BEFORE DELETE OR UPDATE OF deleted ON documents
    FOR EACH ROW
    EXECUTE FUNCTION log_document_update();