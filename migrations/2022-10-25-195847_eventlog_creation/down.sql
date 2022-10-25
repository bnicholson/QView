-- This file should undo anything in `up.sql`

BEGIN;

-- drop the eventlog table
DROP TABLE eventlog;

COMMIT;