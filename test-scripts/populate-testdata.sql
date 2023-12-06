DO $$
DECLARE
    uniqchars	Varchar(6) := left(md5(random()::text),6);
    tidvar  BIGINT := 33;
    tournament_names text[] = array['Q2023','Kentucky Invitational', 'Mission Invitational', 'Quizfest Invitational',
        'Olathe Invitational', 'Tristate', 'St. Louis', 'California', 'Canada', 'Korea'];
    bread_crumbs text[] = array['qf2023', 'kinv', 'minv', 'qf2022', 'oinv', 'tri', 'stlouis', 'california', 'canada', 'sk'];

    venue text[] = array['MVNU', 'Treveca', 'Japan', 'College Church', 'College Church', 'Mount Vernon', 'Bretage', 
        'Point Loma', 'Sash', 'Ulsan'];

    city text[] = array['Nampa', 'Nashville', 'Tokyo', 'Bourbanse', 'Olathe', 'Mount Vernon', 'Ferguson', 'Point Loma', 'Toronto', 'Seoul'];
    region text[] = array['Idaho', 'Tennessee', 'Prefect', 'Illinois', 'Kansas', 'Ohio', 'Missouri', 'California', 'Yukon', 'Corellas'];
    country text[] = array['US', 'USA', 'Japan', 'USA', 'USA', 'USA', 'USA', 'USA', 'Canada', 'South Korea'];
    contact text[] = array['Vernon Preston','Kendrick Larson','Simon Meskill','Elise Shillingford','Cole Terry',
        'Noelle Lawrence','Ross Malcom','Charlie Simonds','George Mendoza','Diana Shepherd' ];
    email text[] = array['vernon.preston@someplace.com','kendrick.larson@someplace.com','simon.meskill@someplace.com',
        'elise.shillingford@someplace.com','cole.terry@someplace.com','noelle.lawrence@someplace.com','ross.malcom@someplace.com',
        'charlie.simonds@someplace.com','george.mendoza@someplace.com','diana.shepherd@someplace.com'];

    fromdate Date := CURRENT_DATE;
    todate Date := CURRENT_DATE + ((random()::integer * 7));
BEGIN

    -- First let's clean up the data in the tables so it can support new data - keeps the costs down
    delete from tournaments;
    delete from divisions;
    delete from apicalllog;
    delete from attachment_blobs;
    delete from attachments;
    delete from division_games;
    delete from eventlogs;
    delete from games;
    delete from quizevents;
  
    -- now it's time to populate some test data
    -- let's start by populating some tournaments and divisions
    for cnt in 1..10 loop

        fromdate := CURRENT_DATE + ((random()*60)::integer) - 30;
        todate := fromdate + ((random()*7)::integer);
        Insert into tournaments (organization,tname,breadcrumb,fromdate,todate,venue,city,region,country,contact,contactemail,hide,shortinfo,info) 
            values ('Nazarene', tournament_names[cnt],bread_crumbs[cnt], fromdate, todate, venue[cnt],
                city[cnt], region[cnt], country[cnt], contact[cnt], email[cnt] ,false, CONCAT('Held at ',venue[cnt]),
                CONCAT('lots of info about this quiz',region[cnt]));

        select tid from tournaments into tidvar where tname = tournament_names[cnt];
        RAISE NOTICE 'TID = % fromdate = % todate = % ', tidvar, fromdate, todate;
        Insert into divisions (tid,dname,breadcrumb,hide,shortinfo) values (tidvar,'District Novice','dn',false,'Quizzers must have quizzed less than one year');
        Insert into divisions (tid,dname,breadcrumb,hide,shortinfo) values (tidvar,'District Experienced','dx',false,'Any quizzer at all');
        Insert into divisions (tid,dname,breadcrumb,hide,shortinfo) values (tidvar,'Local Novice','ln',false,'Local Quizzers must have quizzed less than one year');
        Insert into divisions (tid,dname,breadcrumb,hide,shortinfo) values (tidvar,'Local Experienced','lx',false,'Quizzers must have quizzed less than one year');

    end loop;
    RAISE NOTICE 'Successful setup of SQL data';
END $$;


