-- Your SQL goes here

--BEGIN;

-- create the new eventlog table 
create table eventlogs (
    evid BIGSERIAL NOT NULL,                                        -- event identifier (unique) -- also ensure all events are unique
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,      -- used to ensure we have a unique timestamp to the millisecond    
    clientkey VARCHAR(64) NOT NULL,                                 -- what key/client did this come from
    organization VARCHAR(32) NOT NULL,                              -- organization? Nazarene? World Bible?
    bldgroom VARCHAR(32) NOT NULL,                                  -- what building/room
    tournament VARCHAR(32) NOT NULL,                                -- tournament
    division VARCHAR(32) NOT NULL,                                  -- division
    room VARCHAR(32) NOT NULL,                                      -- room
    round varchar(32) NOT NULL,                                     -- round
    question INTEGER NOT NULL,                                      -- question
    eventnum INTEGER NOT NULL,                                      -- event number
    name VARCHAR(32) NOT NULL,                                      -- name of the quizzer or team
    team INTEGER NOT NULL,                                          -- team # (0-2)
    quizzer INTEGER NOT NULL,                                       -- quizzer (0-4)
    event VARCHAR(2) NOT NULL,                                      -- event (TC, BE, ...)
    parm1 VARCHAR(32) NOT NULL,                                     -- parameter used by a specific event
    parm2 VARCHAR(32) NOT NULL,                                     -- another one
    ts VARCHAR(32) NOT NULL,                                        -- timestamp from the clients viewpoint
    clientip VARCHAR(32) NOT NULL,                                  -- clientip
    md5digest VARCHAR(32) NOT NULL,                                 -- used to ensure we don't have corruption in transmission
    nonce VARCHAR(80) NOT NULL,                                     -- part of the corruption avoidance 
    s1s VARCHAR(32) NOT NULL,                                       -- 
    PRIMARY KEY (evid)
);

-- Now commit all these changes
--COMMIT;

-- all done
