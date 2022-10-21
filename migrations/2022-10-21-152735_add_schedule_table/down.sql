-- This file should undo anything in `up.sql`
-- Your SQL goes here

-- Let's start with a transaction
BEGIN;

-- DROP the table  
DROP TABLE schedules;
DROP TABLE rooms;

-- Commit this
COMMIT;