-- Your SQL goes here

BEGIN;

-- rename the tournaments table to orig_tournaments table
ALTER TABLE tournaments rename to orig_tournaments;
ALTER INDEX tournaments_fromdate rename to orig_tournaments_fromdate;

-- create the new tournaments table 
create table tournaments (
    id BIGSERIAL UNIQUE PRIMARY KEY,
    organization varchar(32) NOT NULL,
    tournament varchar(32) NOT NULL,
    fromdate date NOT NULL,
    todate date NOT NULL,
    venue varchar(64) NOT NULL, 
    city varchar(64) NOT NULL,
    region varchar(64) NOT NULL,
    country varchar(32) NOT NULL,
    contact varchar(64) NOT NULL,
    contactemail varchar(255) NOT NULL,
    hide boolean NOT NULL,
    shortinfo varchar(1024) NOT NULL DEFAULT 'No information is available now.  Check back later.',
    info text NOT NULL DEFAULT 'No information is available now.  Check back later.',
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tournament,organization)
);

-- Create an index on the fromdate so we can find today's tournaments quickly
CREATE INDEX tournaments_fromdate ON tournaments (
    fromdate DESC
);

-- Copy the orig_tournament table to the tournaments table
INSERT INTO tournaments (id, organization,tournament, fromdate, todate, venue, city, region, country,
    contact, contactemail, hide, info, created_at, updated_at)    
    SELECT id, organization,tournament,fromdate,todate,venue,city,region,country,
        contact,contactemail, hide, info, created_at, updated_at from orig_tournaments;

-- now find out the maximum sequence # and reset the sequence to start one past that
-- this code isn't working well but it's a start (10 needs to be a variable somehow selected from the maximum id value)
-- select MAX(id)+1 into maxid from tournaments; 
alter sequence tournaments_id_seq1 RESTART WITH 11;

-- Drop the original table
DROP INDEX orig_tournaments_fromdate;
DROP TABLE orig_tournaments;


-- Now commit all these changes
COMMIT;

-- all done
