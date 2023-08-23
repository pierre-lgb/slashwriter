CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,

    PRIMARY KEY (id),
    UNIQUE (username),
    CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

CREATE TABLE IF NOT EXISTS folders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    name TEXT DEFAULT '' NOT NULL,
    owner_id UUID REFERENCES auth.users DEFAULT auth.uid() NOT NULL,
    parent_id UUID REFERENCES folders (id) ON DELETE CASCADE,
    color TEXT DEFAULT '#8F95B2' NOT NULL,
    deleted BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    deleted_at TIMESTAMP with TIME ZONE
);


CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    title TEXT DEFAULT '' NOT NULL,
    owner_id UUID REFERENCES auth.users DEFAULT auth.uid() NOT NULL,
    folder_id UUID REFERENCES folders (id) NOT NULL,
    parent_id UUID REFERENCES documents (id) ON DELETE CASCADE,
    share_settings UUID,
    state BYTEA,
    text_preview TEXT,
    favorite BOOLEAN DEFAULT false NOT NULL,
    deleted BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);


CREATE TABLE IF NOT EXISTS shares (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    owner_id UUID REFERENCES auth.users DEFAULT auth.uid() NOT NULL,
    document_id UUID REFERENCES documents(id) NOT NULL UNIQUE,
    anyone_permission VARCHAR(10),
    user_permissions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE documents
    DROP CONSTRAINT IF EXISTS documents_share_settings_fkey;
ALTER TABLE documents
    ADD CONSTRAINT documents_share_settings_fkey
    FOREIGN KEY (share_settings) REFERENCES shares (id)
    DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE IF NOT EXISTS realtime_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    user_id UUID REFERENCES auth.users DEFAULT auth.uid() NOT NULL,
    event_type TEXT NOT NULL,
    data JSON,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);