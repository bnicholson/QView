DO $$
DECLARE
    uniqchars	Varchar(6) := left(md5(random()::text),6);
    tidvar  BIGINT := 33;
    tournament_names text[] = array['Q2023-','Kentucky Invitational - ', 'Mission Invitational - ', 'Quizfest Invitational - ',
        'Olathe Invitational - ', 'Tristate -', 'St. Louis -', 'California - ', 'Canada -', 'North Korea - '];
    bread_crumbs text[] = array['qf2023', 'kinv', 'minv', 'qf2022', 'oinv', 'tri', 'stlouis', 'california', 'canada', 'nk'];

    venue text[] = array['MVNU', 'Treveca', 'Japan', 'College Church', 'College Church', 'Mount Vernon', 'Bretage', 
        'Point Loma', 'Sash', 'Hamhung'];

    city text[] = array['Nampa', 'Nashville', 'Tokyo', 'Bourbanse', 'Olathe', 'Mount Vernon', 'Ferguson', 'Point Loma', 'Toronto', 'Pyonyang'];
    region text[] = array['Idaho', 'Tennessee', 'Prefect', 'Illinois', 'Kansas', 'Ohio', 'Missouri', 'California', 'Yukon', 'Corellas'];
    country text[] = array['US', 'USA', 'Japan', 'USA', 'USA', 'USA', 'USA', 'USA', 'Canada', 'North Korea'];
    contact text[] = array['Barry Nicholson','Barry Nicholson','Barry Nicholson','Barry Nicholson','Barry Nicholson',
        'Barry Nicholson','Barry Nicholson','Barry Nicholson','Barry Nicholson','Barry Nicholson' ];
    email text[] = array['someone@someplace.com','someone@someplace.com','someone@someplace.com','someone@someplace.com','someone@someplace.com',
        'someone@someplace.com','someone@someplace.com','someone@someplace.com','someone@someplace.com','someone@someplace.com'];

    fromdate Date := CURRENT_DATE;
    todate Date := CURRENT_DATE + ((random()::integer * 7));
BEGIN
  
    for cnt in 1..10 loop
        todate := CURRENT_DATE + ((random()*7)::integer);
        RAISE NOTICE 'todate = %',todate;
        Insert into tournaments (organization,tname,breadcrumb,fromdate,todate,venue,city,region,country,contact,contactemail,hide,shortinfo,info) 
            values ('Nazarene', CONCAT(tournament_names[cnt],uniqchars),bread_crumbs[cnt], fromdate, todate, venue[cnt],
                city[cnt], region[cnt], country[cnt], contact[cnt], email[cnt] ,false, CONCAT('Held at ',venue[cnt]),
                CONCAT('lots of info about this quiz',region[cnt]));

        select tid from tournaments into tidvar where tname = CONCAT(tournament_names[cnt],uniqchars);
        RAISE NOTICE 'TID = %', tidvar;
        Insert into divisions (tid,dname,breadcrumb,hide,shortinfo) values (tidvar,'District Novice','dn',false,'Quizzers must have quizzed less than one year');
        Insert into divisions (tid,dname,breadcrumb,hide,shortinfo) values (tidvar,'District Experienced','dx',false,'Any quizzer at all');
        Insert into divisions (tid,dname,breadcrumb,hide,shortinfo) values (tidvar,'Local Novice','ln',false,'Local Quizzers must have quizzed less than one year');
        Insert into divisions (tid,dname,breadcrumb,hide,shortinfo) values (tidvar,'Local Experienced','lx',false,'Quizzers must have quizzed less than one year');

    end loop;
END $$;
