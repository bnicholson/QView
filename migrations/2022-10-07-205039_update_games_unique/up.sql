-- Your SQL goes here
-- rebuild the games table in a clean way.
-- key4server is now part of the uniqueness of each row

BEGIN;

-- rename the games table to orig_games table
ALTER TABLE games rename to orig_games;

-- create the new games table 
CREATE TABLE games (
    tdrri uuid DEFAULT uuid_generate_v1() PRIMARY KEY,
    org varchar(32) NOT NULL,
    tournament varchar(32) NOT NULL,
    division varchar(32) NOT NULL,
    room varchar(32) NOT NULL,
    round varchar(32) NOT NULL,
    key4server varchar(64) default '',
    ignore Boolean default false,
    ruleset varchar(32) default 'Nazarene',
    UNIQUE (org, tournament, division, room, round, key4server)
);

-- Copy the orig_tournament table to the tournaments table
INSERT INTO games (tdrri, org, tournament, division, room, round, key4server)    
    SELECT tdrri, org, tournament, division, room, round, key4server from orig_games;

-- Drop the original table
DROP TABLE orig_games;

-- Now commit all these changes
COMMIT;
