-- Your SQL goes here
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE games (
       tdrri uuid DEFAULT uuid_generate_v1() PRIMARY KEY,
       org varchar(32) NOT NULL,
       tournament varchar(32) NOT NULL,
       division varchar(32) NOT NULL,
       room varchar(32) NOT NULL,
       round varchar(32) NOT NULL,
       key4server varchar(64) default '',
       ignore char(1) default 'N',
       UNIQUE (org, tournament, division, room, round));
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
       primary key (tdrri, question, eventnum));
