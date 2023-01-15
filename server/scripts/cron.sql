DROP EXTENSION IF EXISTS pg_cron;
CREATE EXTENSION pg_cron;

GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

SELECT
  cron.schedule(
    'auto-delete-realtime-events',
    '0 * * * *',
    $$
    DELETE FROM realtime_events WHERE created_at < NOW() - INTERVAL '2 minutes';
    $$
  );