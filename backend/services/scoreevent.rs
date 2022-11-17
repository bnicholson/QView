
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
use crate::models::roominfo;
use crate::models::game;
use crate::models::quizevent;
use crate::models::game::{ Game, GameChangeset};

pub async fn write(
    req: HttpRequest,
) -> actix_web::Result<HttpResponse> {
    let db = req.app_data::<Data<Database>>().unwrap();
    let mut mdb = db.pool.get().unwrap();

    // log this api call
    apicalllog(&req);

    // First let's get an eventlog structure, a game structure, and
    // an empty quiz events structure
    let mut eventlog_entry = eventlog::empty_changeset();
    let mut game_entry = game::empty_changeset();
    let mut quizevent_entry = quizevent::empty();
    let mut roominfo_entry = roominfo::empty();

    // Okay, it's now time to search all the parameters and set the associated 
    // variables set in all the data that we will write to the cache
    // or to the database
    let qs = qstring::QString::from(req.query_string());
    let ps = qs.to_pairs();
    let psiter = ps.iter();
    let mut tk=String::new();
    let mut org = "Nazarene".to_string();
    let mut qn_str = String::new();
    let mut e_str = String::new();
    let mut t_str = String::new();
    let mut q_str = String::new();
    let mut ts = Utc::now();
    let mut gid: i64  = 0;
    let mut field_count = 0;
    for pair in psiter {

        let s = String::from(pair.0);
        match s.as_str() {
            "bldgroom" => {
                let tmp = pair.1.replace("+"," ");
                eventlog_entry.bldgroom = (&tmp).to_string();
                roominfo_entry.bldgroom = tmp;
                field_count += 1;               
            },
            "key" => {  // key4server - uniquely identifies a particular client
                let tmp = pair.1.replace("+"," ");
                eventlog_entry.clientkey = (&tmp).to_string();
                roominfo_entry.clientkey = (&tmp).to_string();
                game_entry.clientkey = tmp;
                field_count += 1;
            },
            "tk" => {   // tournament key - short id for a particular tournament
                tk = pair.1.replace("+"," ");   // currently used except to ensure we don't have corruption
                field_count += 1;                
            },
            "org" => {
                org = pair.1.replace("+"," ");   // don't bump the field count because it's not sent by client
            },
            "tn" => { // Tournament Name
                let tmp = pair.1.replace("+"," ");
                eventlog_entry.tournament = (&tmp).to_string();
                roominfo_entry.tournament = (&tmp).to_string();
                game_entry.tournament = tmp;
                field_count += 1;
            },
            "dn" => { // Division Name
                let tmp = pair.1.replace("+"," ");
                eventlog_entry.division = (&tmp).to_string();
                roominfo_entry.division = (&tmp).to_string();
                game_entry.division = tmp;
                field_count += 1;
            },
            "rm" => { // Room 
                let tmp = pair.1.replace("+"," ");
                eventlog_entry.room = (&tmp).to_string();
                roominfo_entry.room = (&tmp).to_string();
                game_entry.room = tmp;
                field_count += 1;
            },
            "rd" => { // Round
                let tmp = pair.1.replace("+"," ");
                eventlog_entry.round = (&tmp).to_string();
                roominfo_entry.round = (&tmp).to_string();
                game_entry.round = tmp;
                field_count += 1;
            }, 
            "qn" => { // Question #
                qn_str = pair.1.replace("+"," ");
                let qn = pair.1.trim().parse().unwrap(); 
                eventlog_entry.question = qn;
                quizevent_entry.question = qn;
                roominfo_entry.question = qn;
                field_count += 1;
            },
            "e" => { // event number
                e_str = pair.1.replace("+"," ");
                let e = pair.1.trim().parse().unwrap();
                eventlog_entry.eventnum = e;
                quizevent_entry.eventnum = e;
                field_count +=1;
            },
            "n" => { // quizzer or team name
                let tmp = pair.1.replace("+"," ");
                quizevent_entry.name = (&tmp).to_string();
                eventlog_entry.name = tmp;
                field_count +=1;
            },
            "t" => { // team # (0-2)
                t_str = pair.1.replace("+"," ");
                let t = pair.1.trim().parse().unwrap();
                quizevent_entry.team = t;
                eventlog_entry.team = t;
                field_count +=1;
            },
            "q" => { // quizzer # (0-4)
                q_str = pair.1.replace("+"," "); 
                let q = pair.1.trim().parse().unwrap();
                quizevent_entry.quizzer = q;
                eventlog_entry.quizzer = q;
                field_count +=1;
            }, 
            "ec" => { // Event type/class (TC, BE, QT, ...
                quizevent_entry.event = pair.1.to_string();
                eventlog_entry.event = pair.1.to_string();
                field_count += 1;
            }, 
            "p1" => { // parameter 1
                let tmp = pair.1.replace("+"," ");
                quizevent_entry.parm1 = (&tmp).to_string();
                eventlog_entry.parm1 = tmp;
                field_count += 1;
            }, 
            "p2" => { // parameter 2 - depends upon what ec is
                let tmp = pair.1.replace("+"," ");
                quizevent_entry.parm2 = (&tmp).to_string();
                eventlog_entry.parm2 = tmp;
                field_count += 1;
            }, 
            "ts" => { // timestamp from the client
                let secs : i64 = pair.1.trim().parse().unwrap();
                ts = Utc.timestamp(secs,0);
                field_count += 1;
            }, 
            "md5" => {  // md5 hashsum
                let tmp = pair.1.replace("+"," ");
                quizevent_entry.md5digest = (&tmp).to_string();
                eventlog_entry.md5digest = tmp;
                field_count += 1;
            },
            "nonce" => {
                let tmp = pair.1.replace("+"," ");
                eventlog_entry.nonce = tmp;
                field_count += 1;
            },
            "s1s" => {
                let tmp = pair.1.replace("+","+");
                eventlog_entry.s1s = tmp;
                field_count += 1;
            },
            "myip" => {
                // this is optional should only be there sometimes.
                let tmp = pair.1.replace("+"," ");
                eventlog_entry.clientip = (&tmp).to_string();
                roominfo_entry.clientip = tmp;
            }
            _ => {
                log::error!("{:?} {:?} Invalid parameter received in /scoreevent api call {:?} ",module_path!(),line!(),
                    pair);
            }
        }
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
    // Grab the HOST:PORT the web server should run on.
    let scoreevent_psk = match std::env::var("SCOREEVENT_PSK") {
        Ok(scoreevent_psk) => {
            scoreevent_psk
        },
        Err(e) => {
            log::error!("{:?} {:?} Invalid SCOREEVENT_PSK",module_path!(),line!());
            "this won't work but fail".to_string()
        }
    };

    sha1hasher.update(&&eventlog_entry.nonce);
    sha1hasher.update(scoreevent_psk);
    sha1hasher.update(&eventlog_entry.bldgroom);
	sha1hasher.update(&eventlog_entry.clientkey);
	sha1hasher.update(&tk);
	sha1hasher.update(&eventlog_entry.tournament);
	sha1hasher.update(&eventlog_entry.division);
    sha1hasher.update(&eventlog_entry.room);
    sha1hasher.update(&eventlog_entry.round);
	sha1hasher.update(&qn_str);
    sha1hasher.update(&e_str);
    sha1hasher.update(&eventlog_entry.name);
    sha1hasher.update(&t_str);
    sha1hasher.update(&q_str);
    sha1hasher.update(&eventlog_entry.event);
    sha1hasher.update(&eventlog_entry.parm1);
    sha1hasher.update(&eventlog_entry.parm2);
    let rslt = sha1hasher.finalize();
    let rsltbase64 = base64::encode(rslt);

    // now grab the result of the sha1hashing
	log::info!("{:?} {:?} ScoreEvent: Org: {} BldgRoom: {}, Key: {}, Tk: {}, TN: {}, DN: {}, Room: {}, Round: {}, Question: {}, EventNumber: {} Name: {} Team: {} Quizzer: {}, EC: {}, Parm1: {} Parm2: {}, Timestamp: {}, Host: {}, MD5: {}, Nonce: {} {}, Sha1sum: {} Calculated sha1sum: {}",
        module_path!(),line!(), org, &eventlog_entry.bldgroom, &eventlog_entry.clientkey, tk, &eventlog_entry.tournament, &eventlog_entry.division, 
        &eventlog_entry.room, &eventlog_entry.round, &eventlog_entry.question, &eventlog_entry.eventnum, &eventlog_entry.name,
        &eventlog_entry.team, &eventlog_entry.quizzer, &eventlog_entry.event, &eventlog_entry.parm1, &eventlog_entry.parm2, 
        ts, &eventlog_entry.clientip, &eventlog_entry.md5digest, &eventlog_entry.nonce, &eventlog_entry.nonce.len(), &eventlog_entry.s1s, rsltbase64 );   
    
    // now make sure we didn't have any corrupted data.  If so print an error and get out
    if !&eventlog_entry.s1s.eq(&rsltbase64) {
        // oh boy!!!
        log::error!("{} {} /api/scoreevent Sha1sums don't match {} {}",module_path!(), line!(), &eventlog_entry.s1s, rsltbase64);
        let error_content = format!("Sha1sums don't match! {} {}",&eventlog_entry.s1s, &rsltbase64);
        return Ok(
            HttpResponse::BadRequest()
                .content_type("text/html; charset=utf-8")
                .body(error_content)
        )
    }

    // now lets log all this information to the eventlog table.
    // This is a file on disk in QMServer.  But we'll put it
    // on the database in the eventlog table for Qview
    match eventlog::write_eventlog(&mut mdb, eventlog_entry) {
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

    // first lets see if we have the game cached.  This will give us the gid for
    // this event.  If gid is <= 0 then this is the first event for this
    // clientkey, org, tournament, division, room, round.
    let mut gid = game::get_gid_from_cache(&game_entry);
    if gid <= 0 {
        // now let's create an entry in the games table
        // Handle errors while we create the entry
        match game::create(&mut mdb, &game_entry) {
            Ok(output) => {
                // update the quizevent gid so we have the correct one to write
                // the quizevent to the Quizzes table
                quizevent_entry.gid = output.gid;
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
                        },
                        _ => {
                            // Okay this error is a database error but not a unique violation
                            log::error!("{:?} {:?} DB Create error {:?} {:?} {:?}",module_path!(), line!(),dbek,info,game_entry);
                        },
                    },
                    _ => {
                        // this is some error but not a database error
                        log::error!("{:?} {:?} DB Create error {:?} {:?}",module_path!(), line!(),e,game_entry);
                    },
                };
           },
        };
    }

    // send an update to the cache for this room.  Rounds in  Progress (tickertape)
    update_roominfo(&mut roominfo_entry);

    // now we need to update the RoomInfo



    
    let mut content = " it worked ";
   
    // now let's write an entry in the quizzes event table
    // Handle errors while we create the entry
    match quizevent::create_quiz_event(&mut mdb, &quizevent_entry) {
        Ok(output) => println!("Inserted a Quizevent {:?}",output),
        Err(err) => match err {
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
                    log::error!("Line: {:?} DB Create error {:?} {:?} {:?}",line!(),dbek,info,quizevent_entry);
                },
            },
            _ => {
                // this is some error but not a database error
                log::error!("Line: {:?} DB Create error {:?} {:?}",line!(),err,quizevent_entry);
            },
        },
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

    let result = game::read_all(&mut mdb);
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

    let result = game::read_all(&mut db);

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

    let result = game::read(&mut db, item_id.into_inner());

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

    let result: Game = game::create(&mut db, &item).expect("Creation error");

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

    let result = game::update(&mut db, item_id.into_inner(), &item);

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

    let result = game::delete(&mut db, item_id.into_inner());

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
