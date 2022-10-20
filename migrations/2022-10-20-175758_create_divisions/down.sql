-- This file should undo anything in `up.sql`
-- Your SQL goes here

BEGIN;

-- Drop these tables
DROP TABLE Divisions;                       -- What divisions are in this tournament
DROP TABLE division_games;                  -- drop the table that tells what quiz games are in this division

-- Now commit all these changes
COMMIT;

-- all done