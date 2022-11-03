
use actix_web::{delete, HttpRequest, Error, get, HttpResponse, post, put, Result, web::{Data, Json, Path}};
use create_rust_app::Database;
use crate::models::common::*;
use chrono::{ Utc, TimeZone };
use std::line;
use std::file;
use base64;
use sha1::{Sha1, Digest};
use diesel::result::Error as DBError;
use crate::models::roominfo::*;
use crate::models::apicalllog::{apicalllog};
use crate::models::eventlog;
use crate::models::game::{ Game, GameChangeset};
use crate::{models, models::scoreevent::{Quizzes }};

pub async fn write(
    req: HttpRequest,
) -> actix_web::Result<HttpResponse> {
    let db = req.app_data::<Data<Database>>().unwrap();
    let mut mdb = db.pool.get().unwrap();

    // log this api call
    apicalllog(&req);

    // First let's get an eventlog structure, a game structure, and
    // an empty quiz events structure
    let mut event_entry = eventlog::empty_changeset();
    let mut game_entry = game::empty_changeset();
    let mut quizevent_entry = quizevent::empty_changeset();
    let mut roominfo_entry = roominfo::empty();

    // Okay, it's now time to search all the parameters and set the associated 
    // variables set in all the data that we will write to the cache
    // or to the database
    let qs = qstring::QString::from(req.query_string());
    let ps = qs.to_pairs();
    let psiter = ps.iter();
    let mut key = String::new();
    let mut tk=String::new();
    let org = "Nazarene".to_string();
    let bldgroom = String::new();
    let mut tn = String::new();
    let mut dn = String::new();
    let mut rm = String::new();
    let mut rd = String::new();
    let mut qn: i32 = 0;
    let mut qnStr = String::new();
    let mut e: i32  = 0;
    let mut eStr = String::new();
    let mut n = String::new();
    let mut t: i32 = 0;
    let mut tStr = String::new();
    let mut q: i32  = 0;
    let mut qStr = String::new();
    let mut ec = String::new();
    let mut p1 = String::new();
    let mut p2 = String::new();
    let mut md5 = "".to_string();
    let mut ts = Utc::now();
    let mut nonce = "".to_string();
    let mut s1s = "".to_string();
    let mut tdrri: i64  = 0;
    let mut clientip = "".to_string();
    let mut bldgroom = String::new();
    let mut i = 0;
    let mut field_count = 0;
    for pair in psiter {
        let s = String::from(pair.0);
        match s.as_str() {
            "bldgroom" => {
                bldgroom = pair.1.replace("+"," ");
                field_count += 1;               
            },
            "key" => {  // key4server - uniquely identifies a particular client
                key = pair.1.replace("+"," ");
                field_count += 1;                
            },
            "tk" => {   // tournament key - short id for a particular tournament
                tk = pair.1.replace("+"," ");
                field_count += 1;                
            },
            "tn" => { // Tournament Name
                tn = pair.1.replace("+"," ");
                field_count += 1;
            },
            "dn" => { // Division Name
                dn = pair.1.replace("+"," ");
                field_count += 1;
            },
            "rm" => { // Room 
                rm = pair.1.replace("+"," ");
                field_count += 1;
            },
            "rd" => { // Round
                rd = pair.1.replace("+"," ");
                field_count += 1;
            }, 
            "qn" => { // Question #
                qnStr = pair.1.replace("+"," ");
                qn = pair.1.trim().parse().unwrap(); 
                field_count += 1;
            },
            "e" => { // event number
                eStr = pair.1.replace("+"," ");
                e = pair.1.trim().parse().unwrap();
                field_count +=1;
            },
            "n" => { // quizzer or team name
                n = pair.1.replace("+"," ");
                field_count +=1;
            },
            "t" => { // team # (0-2)
                tStr = pair.1.replace("+"," ");
                t = pair.1.trim().parse().unwrap();
                field_count +=1;
            },
            "q" => { // quizzer # (0-4)
                qStr = pair.1.replace("+"," "); 
                q = pair.1.trim().parse().unwrap();
                field_count +=1;
            }, 
            "ec" => { // Event type/class (TC, BE, QT, ... 
                ec = pair.1.replace("+"," ");
                field_count += 1;
            }, 
            "p1" => { // parameter 1
                p1 = pair.1.replace("+"," ");
                field_count += 1;
            }, 
            "p2" => { // parameter 2 - depends upon what ec is
                p2 = pair.1.replace("+"," ");
                field_count += 1;
            }, 
            "ts" => { // timestamp from the client
                let secs : i64 = pair.1.trim().parse().unwrap();
                ts = Utc.timestamp(secs,0);
                field_count += 1;
            }, 
            "md5" => {  // md5 hashsum
                md5 = pair.1.to_string();
                field_count += 1;
            },
            "nonce" => {
                nonce = pair.1.to_string();
                field_count += 1;
            },
            "s1s" => {
                s1s = pair.1.to_string();
                field_count += 1;
            },
            "myip" => {
                clientip = pair.1.to_string();  // this is optional should only be there sometimes.
            }
            _ => {
                log::error!("{:?} {:?} Invalid parameter received in /scoreevent api call {:?} ",module_path!(),line!(),
                    pair);
            }
        }
        // debugging println!("Index: {:?} Pair: {:?} {:?}",i,pair.0,pair.1);
        i += 1;
    }

    // Check to make sure we got all the parameters
    let content = "bad parameters";
    if field_count != 19 {
        return Ok(
            HttpResponse::BadRequest()
                .content_type("text/html; charset=utf-8")
                .body(content)
        )
    }

    // create the sha1 object
    let mut sha1hasher = Sha1::new();

    // the following code calculates and checks the sha1sum of all the GET parameters.
    // we had issues with the network (firewalls, app firewalls, etc) corrupting or 
    // giving false 200s.  This avoids that.
    sha1hasher.update(&nonce);
    let psk = "caakokwy13274125359545uranusplutomarssaturn";
    sha1hasher.update(psk);
    sha1hasher.update(&event_entry.bldgroom);
	sha1hasher.update(&key);
	sha1hasher.update(&tk);
	sha1hasher.update(&tn);
	sha1hasher.update(&dn);
    sha1hasher.update(&rm);
    sha1hasher.update(&rd);
	sha1hasher.update(&qnStr);
    sha1hasher.update(&eStr);
    sha1hasher.update(&n);
    sha1hasher.update(&tStr);
    sha1hasher.update(&qStr);
    sha1hasher.update(&ec);
    sha1hasher.update(&p1);
    sha1hasher.update(&p2);
    let rslt = sha1hasher.finalize();
    let rsltbase64 = base64::encode(rslt);

    // now grab the result of the sha1hashing
	log::info!("{:?} {:?} ScoreEvent: Org: {} BldgRoom: {}, Key: {}, Tk: {}, TN: {}, DN: {}, Room: {}, Round: {}, Question: {}, EventNumber: {} Name: {} Team: {} Quizzer: {}, EC: {}, Parm1: {} Parm2: {}, Timestamp: {}, Host: {}, MD5: {}, Nonce: {} {}, Sha1sum: {} Calculated sha1sum: {}",
        module_path!(),line!(), org, &bldgroom, key, tk, tn, dn, rm, rd, qn, e, n, t, q, ec, p1, p2, ts, clientip, md5, nonce, nonce.len(), s1s, rsltbase64 );   
    
    // now make sure we didn't have any corrupted data.  If so print an error and get out
    if !s1s.eq(&rsltbase64) {
        // oh boy!!!
        log::error!("{} {} /api/scoreevent Sha1sums don't match {} {}",module_path!(), line!(), s1s, rsltbase64);
        let error_content = format!("Sha1sums don't match! {} {}",&s1s, &rsltbase64);
        return Ok(
            HttpResponse::BadRequest()
                .content_type("text/html; charset=utf-8")
                .body(error_content)
        )
    }

    // now lets log all this information to the eventlog table.
    // This is a file on disk in QMServer.  But we'll put it
    // on the database in the eventlog table
    match eventlog::write_eventlog(&mut mdb, &org.to_string(), &bldgroom, &key, &tk, &tn, &dn, &rm, &rd, qn, e, &n, t, q, &ec, &p1, &p2, &ts.to_string(), &clientip, &md5, &nonce, &s1s) {
        Ok(eventlog) => {
            // okay we wrote to eventlog - do nothing
        },
        Err(e) => {
            log::error!("{} {} Eventlog write failure: {}",module_path!(),line!(),e);
            let error_content = format!("Eventlog write failure {}", e);
            return Ok(
                HttpResponse::BadRequest()
                    .content_type("text/html; charset=utf-8")
                    .body(error_content)
            )
        }
    }

    // Now given the tournament, division, room, and round, let's see if we can get the tdrrinfo from 
    // cache.   This would also include the tdrri

    // now we need to update the RoomInfo

    // now let's write all this to the database.
    // now populate the Game
    let game = GameChangeset {
        org: "Nazarene".to_string(),
        tournament: tn,
        division: dn,
        room: rm,
        round: rd,
        key4server: Some(key),
        ignore: Some(false),
        ruleset: "Nazarene".to_string()
    };

    // Now populate the quizzes event
    let mut quizevent = Quizzes {
        tdrri: tdrri,
        question: qn,
        eventnum: e,
        name: n,
        team: t,
        quizzer: q,
        event: ec,
        parm1: Some(p1),
        parm2: Some(p2),
        clientts: Some(ts),
        serverts: Some(Utc::now()),
        md5digest: Some(md5)
    };

    // now let's create an entry in the games table
    // Handle errors while we create the entry
    match models::game::create(&mut mdb, &game) {
        Ok(output) => {
            // update the quizevent tdrri so we have the correct one to write
            // the quizevent to the Quizzes table
            quizevent.tdrri = output.tdrri;
        },
        Err(e) => {
            match e {
               // the most likely cause here is a Unique constraint - the row
                // already exists in the database.  We'll ignore those and
                // panic or log the others
                DBError::DatabaseError(dbek,info) => match dbek {
                    UniqueViolation => {
                        // do nothing here.  This is a normal case when another event 
                        // comes in for this quiz.
                        log::error!("{:?} {:?} Error {:?}", module_path!(),line!(), info);
 //                       quizevent.tdrri = output.tdrri;
                    },
                    _ => {
                        // Okay this error is a database error but not a unique violation
                        log::error!("{:?} {:?} DB Create error {:?} {:?} {:?}",module_path!(), line!(),dbek,info,game);
                    },
                },
                _ => {
                    // this is some error but not a database error
                    log::error!("{:?} {:?} DB Create error {:?} {:?}",module_path!(), line!(),e,game);
                },
            };
        },
    };

    // let's print out the tdrri we got
//    log::info!("Line: {:?} TDRRI = {:?}",line!(),quiz.tdrri);
    
    let mut content = " it worked ";
   
    // now let's write an entry in the quizzes event table
    // Handle errors while we create the entry
    match models::scoreevent::create_quiz_event(&mut mdb, &quizevent) {
        Ok(output) => println!("Inserted a Quizevent {:?}",output),
        Err(e) => match e {
            // the most likely cause here is a Unique constraint - the row
            // already exists in the database.  We'll ignore those and
            // panic or log the others
            DBError::DatabaseError(dbek,info) => match dbek {
                UniqueViolation => {
                    // Okay we've written this one before.  Now we have to update it. 
                    content = "Update";
                },
                _ => {
                    // Okay this error is a database error but not a unique violation
                    log::error!("Line: {:?} DB Create error {:?} {:?} {:?}",line!(),dbek,info,quizevent);
                },
            },
            _ => {
                // this is some error but not a database error
                log::error!("Line: {:?} DB Create error {:?} {:?}",line!(),e,quizevent);
            },
        },
        _ => {
            log::error!("Line: {:?} Unknown error {:?} {:?}", line!(), e, quizevent);
        }
    }

    // now populate the Game Changeset
//    Json(item): Json<GameChangeset>;
//    let result: Game = models::scoreevent::create(&mut db, &item).expect("Creation error");

//    Ok(HttpResponse::Created().json(result));

    Ok(
        HttpResponse::Ok()
            .content_type("text/html; charset=utf-8")
            .body(content)
    )
}

fn print_type_of<T>(_: &T) {
    println!("{}", std::any::type_name::<T>())
}

pub async fn index_playground(
    req: HttpRequest,
) -> actix_web::Result<HttpResponse> {

    let db = req.app_data::<Data<Database>>().unwrap();
    let mut mdb = db.pool.get().unwrap();

    let content = std::fs::read_to_string("./.cargo/graphql-playground.html").unwrap();

    let result = models::game::read_all(&mut mdb);
    println!("{:?}",result);

    Ok(
        HttpResponse::Ok()
            .content_type("text/html; charset=utf-8")
            // GraphQL Playground original source:
            // .body(playground_source(
            //     GraphQLPlaygroundConfig::new("/api/graphql")
            //         .with_header("Authorization", "token")
            //         .subscription_endpoint("/api/graphql/ws"),
            // ))

            // GraphQL Playground modified source to include authentication:
            .body(content)
    )
}


#[get("")]
async fn index(
    db: Data<Database>,
//    Query(info): Query<PaginationParams>,
//    info: web::Path<Info>,
//    path: web::Path<(String,String,String)>,
    req: HttpRequest,
) -> HttpResponse {
    let mut db = db.pool.get().unwrap();
    
    print_type_of(&db); 

    println!("Method: {:?}",req.method()); 
    println!("URI: {:?}",req.uri()); 
    println!("Version: {:?}",req.version());     
    println!("URI: {:?}",req.uri()); 
    println!("Path: {:?}",req.path()); 
    println!("URI: {:?}",req.uri()); 
    println!("Query_string: {:?}",req.query_string()); 

    let result = models::game::read_all(&mut db);

    if result.is_ok() {
        HttpResponse::Ok().json(result.unwrap())
    } else {
        HttpResponse::InternalServerError().finish()
    }
}

#[get("/{id}")]
async fn read(
    db: Data<Database>,
    item_id: Path<BigId>,
) -> HttpResponse {
    println!("read endpoint");
    let mut db = db.pool.get().unwrap();

    let result = models::game::read(&mut db, item_id.into_inner());

    if result.is_ok() {
        HttpResponse::Ok().json(result.unwrap())
    } else {
        HttpResponse::NotFound().finish()
    }
}

#[post("")]
async fn create(
    db: Data<Database>,
    Json(item): Json<GameChangeset>,
) -> Result<HttpResponse, Error> {
    println!("create endpoint");
    let mut db = db.pool.get().unwrap();

    let result: Game = models::game::create(&mut db, &item).expect("Creation error");

    Ok(HttpResponse::Created().json(result))
}

#[put("/{id}")]
async fn update(
    db: Data<Database>,
    item_id: Path<BigId>,
    Json(item): Json<GameChangeset>,
) -> HttpResponse {
    println!("update endpoint");
    let mut db = db.pool.get().unwrap();

    let result = models::game::update(&mut db, item_id.into_inner(), &item);

    if result.is_ok() {
        HttpResponse::Ok().finish()
    } else {
        HttpResponse::InternalServerError().finish()
    }
}

#[delete("/{id}")]
async fn destroy(
    db: Data<Database>,
    item_id: Path<BigId>,
) -> HttpResponse {
    println!("destroy endpoint");
    let mut db = db.pool.get().unwrap();

    let result = models::game::delete(&mut db, item_id.into_inner());

    if result.is_ok() {
        HttpResponse::Ok().finish()
    } else {
        HttpResponse::InternalServerError().finish()
    }
}

pub fn endpoints(scope: actix_web::Scope) -> actix_web::Scope {
    return scope
        .service(index)
        .service(read)
        .service(create)
        .service(update)
        .service(destroy);
}
