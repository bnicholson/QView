-- Your SQL goes here

-- Let's start with a transaction
--BEGIN;

-- create the table that defines the rooms
CREATE TABLE rooms (
    roomid BIGSERIAL UNIQUE PRIMARY KEY NOT NULL,       -- a unique id for the room
    tid BIGINT NOT NULL,                                -- what is the tournament for this rooms
    name varchar(32) NOT NULL,                          -- room name itself
    building varchar(32),                               -- what build is this room in
    UNIQUE (roomid,tid,name)
);

-- create the table
CREATE TABLE schedules (
    sid BIGSERIAL UNIQUE PRIMARY KEY,       -- schedule id 
    tid BIGINT NOT NULL,                    -- tournament id (associated tournament)
	roundtime timestamptz NOT NULL,         -- this should be the time the quiz should start in the local environment
	tournament varchar(32) NOT NULL,        -- name of the tournament
	division varchar(32) NOT NULL,          
	room varchar(32) NOT NULL,
	round varchar(32) NOT NULL,
	team1 varchar(32),
	team2 varchar(32),
	team3 varchar(32),
	quizmaster varchar(32),
	contentjudge varchar(32),
	scorekeeper varchar(32),
	stats varchar(1024),
    UNIQUE (tid,roundtime, room)
);

-- 

-- Commit this
--COMMIT;
