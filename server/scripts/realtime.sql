-- remove the supabase_realtime publication
drop publication if exists supabase_realtime;

-- re-create the supabase_realtime publication with no tables
create publication supabase_realtime;


CREATE TABLE IF NOT EXISTS realtime_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  user_id UUID REFERENCES auth.users DEFAULT auth.uid() NOT NULL,
  event_type TEXT NOT NULL,
  data JSON,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER PUBLICATION supabase_realtime ADD TABLE realtime_events;

ALTER TABLE realtime_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users have access to their own events" ON realtime_events;
CREATE POLICY "Users have access to their own events" ON realtime_events
  FOR SELECT USING (auth.uid() = user_id);