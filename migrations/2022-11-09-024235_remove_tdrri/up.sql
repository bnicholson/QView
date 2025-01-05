-- Your SQL goes here

-- start the atomic portion
--BEGIN;

-- Save the tables away
ALTER TABLE games rename to orig_games;

-- Now create the new updated tables for games
CREATE TABLE games (
    gid BIGSERIAL PRIMARY KEY,                                      -- unique identifier (Tournament, Division, Room, Round, Id)    
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
INSERT INTO games (gid,org,tournament,division,room,round,clientkey,ignore,ruleset) 
    SELECT  tdrri, org, tournament, division, room, round, clientkey, ignore, ruleset from orig_games;

-- Now drop all the old original tables
DROP TABLE orig_games;

-- Save the tables away
ALTER TABLE quizevents rename to orig_quizevents;

-- Now create the quizzes table updated
CREATE TABLE quizevents (
       gid BIGINT NOT NULL,                                 -- unique identifier (Tournament, Division, Room, Round, Id)
       question integer NOT NULL,                           -- Question (part of the key), what question is this event
       eventnum integer NOT NULL,                           -- There can be multiple events per question
       name varchar(64) NOT NULL,                           -- A Quizzer name or team name
       team integer NOT NULL,                               -- team #   (0-2)
       quizzer integer NOT NULL,                            -- quizzer # (0-4)
       event varchar(2) NOT NULL,                           -- event identifier (TC, BE, ...)
       parm1 varchar(8) NOT NULL,                           -- parameter for an event
       parm2 varchar(8) NOT NULL,                           -- parameter #2 for an event
       clientts timestamptz NOT NULL,                       -- timestampe when the client thought this happened
       serverts timestamptz NOT NULL,                       -- server time when this event was received
       md5digest varchar(32) NOT NULL default '',           -- md5digest of all the data - helps avoid corruption
       primary key (gid, question, eventnum));

-- Now copy the old table into the new table
INSERT INTO quizevents (gid, question, eventnum, name, team, quizzer, event, parm1, parm2, clientts, serverts, md5digest) 
    SELECT tdrri, question, eventnum, name, team, quizzer, event, parm1, parm2, clientts, serverts, md5digest from orig_quizevents;

-- Now drop all the old original tables
DROP TABLE orig_quizevents;

-- Commit
--COMMIT;

-- All Done
