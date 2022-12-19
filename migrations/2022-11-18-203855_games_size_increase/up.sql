-- Your SQL goes here

BEGIN;

-- Save the tables away
ALTER TABLE games RENAME to orig_games;
ALTER SEQUENCE games_gid_seq RENAME to orig_games_gid_seq;
ALTER INDEX games_org_tournament_division_room_round_clientkey_key1 RENAME to orig_games_org_tournament_division_room_round_clientkey_key;

-- Now create the new updated tables for games
CREATE TABLE games (
    gid BIGSERIAL PRIMARY KEY,                                      -- unique identifier (Tournament, Division, Room, Round, Id)    
    org varchar(48) NOT NULL,                                       -- what org is this quiz from
    tournament varchar(48) NOT NULL,                                -- What tournament is this quiz for
    division varchar(48) NOT NULL,                                  -- What division
    room varchar(48) NOT NULL,                                      -- What room is this quiz in
    round varchar(48) NOT NULL,                                     -- What round are we in
    clientkey varchar(64) NOT NULL default '',                      -- Unique id for the client quizmachine
    ignore Boolean NOT NULL default false,                          -- Should this game be ignored
    ruleset varchar(32) NOT NULL default 'Nazarene',                -- what rulese were used by this quiz
    UNIQUE (org, tournament, division, room, round, clientkey)
);

-- Now copy the old table into the new table
INSERT INTO games (gid,org,tournament,division,room,round,clientkey,ignore,ruleset) 
    SELECT  gid, org, tournament, division, room, round, clientkey, ignore, ruleset from orig_games;

-- now find out the maximum sequence # and reset the sequence to start one past that
-- select MAX(id)+1 into maxid from tournaments; 
select pg_catalog.setval('games_gid_seq'::regclass, MAX("gid")+1,true) FROM "orig_games";

-- Now drop all the old original tables
DROP TABLE orig_games;
--DROP SEQUENCE orig_games_gid_seq;
--DROP INDEX orig_games_org_tournament_division_room_round_clientkey_key1;

-- commit this
COMMIT;
