-- Your SQL goes here

--BEGIN;

-- create the new divisions table 
create table divisions (
    did BIGSERIAL UNIQUE PRIMARY KEY,       -- division identifier (unique)
    tid BIGINT,                             -- tournament id - which tournament this division is in
    dname varchar(32) NOT NULL,              -- division name
    breadcrumb varchar(32) NOT NULL,        -- breadcrumb name (used to create short urls)
    hide boolean NOT NULL,                  -- hide this division from the average user or not
    shortinfo varchar(1024) NOT NULL DEFAULT 'No information is available now.  Check back later.',  -- human information
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tid,did)
);

create table division_games (
    did BIGINT,                 -- Division id
    tdrri BIGINT,               -- ID of a particular quiz game
    PRIMARY Key (did,tdrri)     -- ensure that we don't duplicate quiz games in a division
);

-- Now commit all these changes
--COMMIT;

-- all done
