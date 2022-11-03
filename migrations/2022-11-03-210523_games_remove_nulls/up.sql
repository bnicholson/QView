-- Your SQL goes here

-- start the atomic portion
BEGIN;

-- Save the tables away
ALTER TABLE games rename to orig_games;

-- Now create the new updated tables for games
CREATE TABLE games (
    tdrri BIGSERIAL PRIMARY KEY,                                    -- unique identifier (Tournament, Division, Room, Round, Id)    
    org varchar(32) NOT NULL,                                       -- what org is this quiz from
    tournament varchar(32) NOT NULL,                                -- What tournament is this quiz for
    division varchar(32) NOT NULL,                                  -- What division
    room varchar(32) NOT NULL,                                      -- What room is this quiz in
    round varchar(32) NOT NULL,                                     -- What round are we in
    clientkey varchar(64) NOT NULL default '',                      -- Unique id for the client quizmachine
    ignore Boolean NOT NULL default false,                          -- Should this game be ignored
    ruleset varchar(32) NOT NULL default 'Nazarene',                -- what rulese were used by this quiz
    UNIQUE (org, tournament, division, room, round, clientkey)
);

-- Now copy the old table into the new table
-- since these tables are currently empty don't copy from old to new
-- Something like --- INSERT INTO division_games (did,tdrri) SELECT did,tdrri from orig_division_games;

-- Now drop all the old original tables
DROP TABLE orig_games;

-- Commit
COMMIT;

-- All Done