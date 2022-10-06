-- rebuild the tournament table in a clean way.

BEGIN;

-- rename the tournaments table to orig_tournaments table
ALTER TABLE tournaments RENAME to orig_tournaments;
ALTER INDEX IF EXISTS tournaments_fromdate RENAME to orig_tournaments_fromdate;

-- create the new tournaments table 
create table tournaments (
    id BIGSERIAL PRIMARY KEY,
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
    info text,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tournament,organization)
);

-- Create an index on the fromdate so we can find today's tournaments quickly
CREATE INDEX tournaments_fromdate ON tournaments (
    fromdate DESC
);

-- Copy the orig_tournament table to the tournaments table
INSERT INTO tournaments (organization,tournament, fromdate, todate, venue, city, region, country,
    contact, contactemail, hide)    
    SELECT organization,tournament,fromdate,todate,venue,city,region,country,
        contact,contactemail, hide from orig_tournaments;

-- Drop the original table
DROP TABLE orig_tournaments;

-- Now commit all these changes
COMMIT;

-- all done

