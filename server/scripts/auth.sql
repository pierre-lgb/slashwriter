-- +------------------------------------------+
-- |                   AUTH                   |
-- +------------------------------------------+

-- Trigger on auth user created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    folder_id UUID;
BEGIN
    INSERT INTO profiles (id, username, email)
      VALUES (NEW.id, split_part(NEW.email, '@', 1), NEW.email);
    
    INSERT INTO folders (owner_id, name)
      VALUES (NEW.id, 'Welcome');

    SELECT f.id INTO folder_id FROM folders f WHERE owner_id = new.id;
    
    INSERT INTO documents (owner_id, folder_id, title, state)
      VALUES (new.id, folder_id, 'Welcome to Slashwriter', get_welcome_document_state());

    RETURN NEW;
end;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created on auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE PROCEDURE handle_new_user();

-- Trigger on auth user deleted
CREATE OR REPLACE FUNCTION handle_delete_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    -- Perform the deletion
    DELETE FROM documents WHERE owner_id = OLD.id;
    DELETE FROM shares WHERE owner_id = OLD.id;
    DELETE FROM realtime_events WHERE user_id = OLD.id;
    DELETE FROM folders WHERE owner_id = OLD.id;
    DELETE FROM profiles WHERE id = OLD.id;

    RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
    BEFORE DELETE ON auth.users
    FOR EACH ROW 
    EXECUTE PROCEDURE handle_delete_user();

-- Trigger on auth user updated
CREATE OR REPLACE FUNCTION handle_update_user() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    UPDATE profiles
    SET email = NEW.email
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE handle_update_user();

DROP POLICY IF EXISTS "Profiles SELECT policy" ON profiles;
CREATE POLICY "Profiles SELECT policy" ON profiles
  AS PERMISSIVE FOR SELECT
  TO public
  USING (true)