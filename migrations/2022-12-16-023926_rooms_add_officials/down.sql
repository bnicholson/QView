-- This file should undo anything in `up.sql`


-- Let's start with a transaction
BEGIN;

-- Save the tables away
ALTER TABLE rooms RENAME to orig_rooms;
ALTER SEQUENCE rooms_roomid_seq RENAME to orig_rooms_roomid_seq;
ALTER INDEX rooms_pkey RENAME to orig_rooms_pkey;
ALTER INDEX rooms_roomid_tid_name_key RENAME to orig_rooms_roomid_tid_name_key;

-- create the table that defines the rooms
CREATE TABLE rooms (
    roomid BIGSERIAL UNIQUE PRIMARY KEY NOT NULL,       -- a unique id for the room
    tid BIGINT NOT NULL,                                -- what is the tournament for this rooms
    name varchar(32) NOT NULL,                          -- room name itself
    building varchar(32) NOT NULL DEFAULT '',           -- what build is this room in
    UNIQUE (roomid,tid,name)
);

-- Now copy the old table into the new table
INSERT INTO rooms (roomid,tid, name, building) 
    SELECT  roomid, tid, name, building from orig_rooms;

-- now find out the maximum sequence # and reset the sequence to start one past that
select pg_catalog.setval('rooms_roomid_seq'::regclass, MAX("roomid")+1,true) FROM "orig_rooms";

-- Now drop all the old original tables
DROP TABLE orig_rooms;
--DROP SEQUENCE orig_rooms_roomid_seq;
--DROP INDEX orig_rooms_pkey;
--DROP INDEX orig_rooms_roomid_tid_name_key;

-- commit this
COMMIT;
