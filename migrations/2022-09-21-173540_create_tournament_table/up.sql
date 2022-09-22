
create table tournaments (
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
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL,
    PRIMARY KEY (tournament,organization)
);
