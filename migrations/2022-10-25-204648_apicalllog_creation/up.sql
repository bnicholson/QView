-- Your SQL goes here

--BEGIN;

-- create the new eventlog table 
create table apicalllog (
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,      -- used to ensure we have a unique timestamp to the millisecond    
    apicallid BIGSERIAL PRIMARY KEY NOT NULL,                       -- apicall log identifier (unique) -- also ensure all call logs are unique
    method VARCHAR(8) NOT NULL,                                     -- What method was used
    uri TEXT NOT NULL,                                              -- the uri itself
    version VARCHAR(32) NOT NULL,                                   -- what version did this come from
    headers TEXT NOT NULL                                           -- what headers existed
);

-- Now commit all these changes
--COMMIT;

-- all done
