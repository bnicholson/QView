-- This file should undo anything in `up.sql`

-- Automic!!
BEGIN;

-- Save the tables away
ALTER TABLE games rename to orig_games;
ALTER TABLE quizzes rename to orig_quizzes;

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

CREATE TABLE quizzes (
       tdrri uuid NOT NULL,
       question integer,
       eventnum integer,
       name varchar(64),
       team integer,
       quizzer integer,
       event varchar(2),
       parm1 varchar(8),
       parm2 varchar(8),
       ts timestamptz,
       md5digest varchar(32) default '',
       primary key (tdrri, question, eventnum)
);
-- Now drop all the old original tables
DROP TABLE orig_games;
DROP TABLE orig_quizzes;

-- put everything to disk
COMMIT;

-- all done