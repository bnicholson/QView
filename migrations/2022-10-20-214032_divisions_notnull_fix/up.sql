-- Your SQL goes here

BEGIN;

-- Rename the division table to orig_division
ALTER TABLE divisions RENAME to orig_divisions;
ALTER TABLE division_games RENAME to orig_division_games;

-- create the new divisions table 
create table divisions (
    did BIGSERIAL UNIQUE PRIMARY KEY,       -- division identifier (unique)
    tid BIGINT NOT NULL,                    -- tournament id - which tournament this division is in
    dname varchar(32) NOT NULL,             -- division name
    breadcrumb varchar(32) NOT NULL,        -- breadcrumb name (used to create short urls)
    hide boolean NOT NULL,                  -- hide this division from the average user or not
    shortinfo varchar(1024) NOT NULL DEFAULT 'No information is available now.  Check back later.',  -- human information
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tid,did)
);

create table division_games (
    did BIGINT NOT NULL,                 -- Division id
    tdrri BIGINT NOT NULL,               -- ID of a particular quiz game
    PRIMARY Key (did,tdrri)     -- ensure that we don't duplicate quiz games in a division
);

-- Copy the orig_divisions table to the divisions table
INSERT INTO divisions (did, tid, dname, breadcrumb, hide, shortinfo, created_at, updated_at)  
    SELECT did, tid, dname, breadcrumb, hide, shortinfo, created_at, updated_at from orig_divisions;

-- copy the orig_division_games table to the division_games table
INSERT INTO division_games (did,tdrri) SELECT did,tdrri from orig_division_games;

-- now find out the maximum sequence # and reset the sequence to start one past that
-- this code isn't working well but it's a start (10 needs to be a variable somehow selected from the maximum id value)
-- select MAX(id)+1 into maxid from tournaments; 
alter sequence divisions_did_seq RESTART WITH 2;

-- Drop the original table
DROP TABLE orig_divisions;
DROP TABLE orig_division_games;

-- Now commit all these changes
COMMIT;

-- all done