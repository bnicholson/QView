-- Your SQL goes here

-- start the atomic portion
--BEGIN;

-- Save the tables away
ALTER TABLE quizzes rename to orig_quizzes;

-- Now create the quizzes table updated
CREATE TABLE quizevents (
       tdrri BIGINT NOT NULL,                               -- unique identifier (Tournament, Division, Room, Round, Id)
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
       primary key (tdrri, question, eventnum));

-- Now copy the old table into the new table
-- since these tables are currently empty don't copy from old to new
-- Something like --- INSERT INTO division_games (did,tdrri) SELECT did,tdrri from orig_division_games;

-- Now drop all the old original tables
DROP TABLE orig_quizzes;

-- Commit
--COMMIT;

-- All Done
