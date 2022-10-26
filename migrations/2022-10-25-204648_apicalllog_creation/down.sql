-- This file should undo anything in `up.sql`

BEGIN;

-- Now DROP the apicalllog table
DROP TABLE apicalllog;

COMMIT;

-- all done