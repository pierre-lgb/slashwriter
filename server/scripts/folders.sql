-- +------------------------------------------+
-- |                  FOLDERS                 |
-- +------------------------------------------+
CREATE TABLE IF NOT EXISTS folders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    name TEXT DEFAULT '' NOT NULL,
    owner_id UUID REFERENCES auth.users DEFAULT uid() NOT NULL,
    parent_id UUID REFERENCES folders (id) ON DELETE CASCADE,
    color TEXT DEFAULT '#8F95B2' NOT NULL,
    deleted BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    deleted_at TIMESTAMP with TIME ZONE
);



DROP VIEW IF EXISTS user_folders_tree;
CREATE VIEW user_folders_tree AS 
SELECT id, name, parent_id, color, updated_at
FROM folders
WHERE owner_id = uid() AND NOT deleted
ORDER BY updated_at desc;

ALTER VIEW user_documents_tree OWNER TO authenticated;



-- Row level security
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Folders INSERT policy" ON folders;
CREATE POLICY "Folders INSERT policy" ON folders
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Folders SELECT policy" ON folders;
CREATE POLICY "Folders SELECT policy" ON folders
  FOR SELECT USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Folders UPDATE policy" ON folders;
CREATE POLICY "Folders UPDATE policy" ON folders
  FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Folders DELETE policy" ON folders;
CREATE POLICY "Folders DELETE policy" ON folders
  FOR DELETE USING (auth.uid() = owner_id);



-- Log folders updates in the "realtime_updates" table
CREATE OR REPLACE FUNCTION log_folder_update()
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
            'folder.' || (CASE
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
                        'name', NEW.name,
                        'parent_id', NEW.parent_id,
                        'color', NEW.color,
                        'updated_at', NEW.updated_at
                    )
            END
        );
    RETURN NEW;
END
$$;

DROP TRIGGER IF EXISTS handle_folder_update ON folders;
CREATE TRIGGER handle_folder_update
    BEFORE INSERT OR DELETE OR UPDATE OF name, color, deleted ON FOLDERS
    FOR EACH ROW
    EXECUTE FUNCTION log_folder_update();



CREATE OR REPLACE FUNCTION update_subitems_on_temp_delete_folder()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
    -- update the deleted and deleted_at columns for the current folder
    UPDATE folders SET deleted = NEW.deleted, deleted_at = (CASE WHEN NEW.deleted THEN NOW() ELSE NULL END) WHERE id = NEW.id;
   
    -- update the deleted and deleted_at columns for all subfolders
    WITH recursive subfolders AS (
        SELECT id, deleted_at FROM folders WHERE id = NEW.id
        UNION ALL
        SELECT f.id, f.deleted_at FROM subfolders s
        JOIN folders f ON s.id = f.parent_id
    )
    UPDATE folders SET 
        deleted = NEW.deleted, 
        deleted_at = (CASE WHEN NEW.deleted THEN NOW() ELSE NULL END) 
    FROM subfolders WHERE folders.id = subfolders.id AND 
        (NEW.deleted = true AND subfolders.deleted_at IS NULL) OR 
        (NEW.deleted = false AND subfolders.deleted_at = OLD.deleted_at);

    -- update the deleted and deleted_at columns for all subdocuments in the current folder and its subfolders
    WITH recursive subfolders_documents AS (
        SELECT id, deleted_at FROM folders WHERE id = NEW.id
        UNION ALL
        SELECT f.id, f.deleted_at FROM subfolders_documents s
        JOIN folders f ON s.id = f.parent_id
    )
    UPDATE documents SET 
        deleted = NEW.deleted, 
        deleted_at = (CASE WHEN NEW.deleted THEN NOW() ELSE NULL END) 
    FROM subfolders_documents WHERE documents.folder_id = subfolders_documents.id AND
        (NEW.deleted = true AND documents.deleted_at IS NULL) OR 
        (NEW.deleted = false AND documents.deleted_at = OLD.deleted_at);

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_subitems_on_temp_delete_folder ON folders;
CREATE TRIGGER update_subitems_on_temp_delete_folder
    AFTER UPDATE OF deleted ON folders
    FOR EACH ROW WHEN (pg_trigger_depth() < 1 AND OLD.deleted IS DISTINCT FROM NEW.deleted)
    EXECUTE PROCEDURE update_subitems_on_temp_delete_folder();
