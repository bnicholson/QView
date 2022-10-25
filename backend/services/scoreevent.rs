
use actix_web::{delete, HttpRequest, Error, get, HttpResponse, post, put, Result, web::{Data, Json, Path}};
use actix_web::middleware::{ Logger };
use create_rust_app::Database;
use crate::{models, models::scoreevent::{Game, GameChangeset, Quizzes, QuizzesChangeset}};
use crate::models::common::*;
use qstring::QString;
use chrono::{ Utc, TimeZone };
use std::line;
use std::file;
use diesel::result::Error as DBError;
use diesel::result::DatabaseErrorKind;

pub async fn write(
    req: HttpRequest,
) -> actix_web::Result<HttpResponse> {
    let db = req.app_data::<Data<Database>>().unwrap();
    let mut mdb = db.pool.get().unwrap();

//    print_type_of(&mdb);
    println!("Method: {:?}",req.method()); 
    println!("URI: {:?}",req.uri()); 
    println!("Version: {:?}",req.version()); 
    println!("Headers: {:?}",req.headers());
    println!("Match_info: {:?}",req.match_info());    
    println!("Peer_address {:?}",req.peer_addr());
    println!("URI: {:?}",req.uri()); 
    println!("Path: {:?}",req.path()); 
    println!("URI: {:?}",req.uri()); 
    println!("Query_string: {:?}",req.query_string()); 
    println!("Cookies: {:?}", req.cookies());
    println!("Content-type: {:?}",req.content_type());
    println!("Encoding: {:?}",req.encoding());
    println!("Mime-type: {:?}",req.mime_type());
    println!("Body (content): {:?}",req.body());


    let qs = qstring::QString::from(req.query_string());
    let ps = qs.to_pairs();
    println!("Pairs: {:?}",ps);
    let psiter = ps.iter();
    let mut key = "";
    let mut tk="";
    let mut org = "";
    let mut tn = "";
    let mut dn = "";
    let mut rm = "";
    let mut rd = "";
    let mut qn: i32 = 0;
    let mut e: i32  = 0;
    let mut n = "";
    let mut t: i32 = 0;
    let mut q: i32  = 0;
    let mut ec = "";
    let mut p1 = "";
    let mut p2 = "";
    let mut md5 = "";
    let mut ts = Utc::now();
    let mut nonce = "";
    let mut s1s = "";
    let mut tdrri: i64  = 0;

    let mut i = 0;
    let mut field_count = 0;
    for pair in psiter {
        let s = String::from(pair.0);
        match s.as_str() {
            "key" => {  // key4server - uniquely identifies a particular client
                key = pair.1;
                field_count += 1;                
            },
            "tk" => {   // tournament key - short id for a particular tournament
                tk = pair.1;
                field_count += 1;                
            },
            "tn" => { // Tournament Name
                tn = pair.1;
                field_count += 1;
            },
            "dn" => { // Division Name
                dn = pair.1;
                field_count += 1;
            },
            "rm" => { // Room 
                rm = pair.1;
                field_count += 1;
            },
            "rd" => { // Round
                rd = pair.1;
                field_count += 1;
            }, 
            "qn" => { // Question #
                qn = pair.1.trim().parse().unwrap(); 
                field_count += 1;
            },
            "e" => { // event number
                e = pair.1.trim().parse().unwrap();
                field_count +=1;
            },
            "n" => { // quizzer or team name
                n = pair.1;
                field_count +=1;
            },
            "t" => { // team # (0-2)
                t = pair.1.trim().parse().unwrap();
                field_count +=1;
            },
            "q" => { // quizzer # (0-4) 
                q = pair.1.trim().parse().unwrap();
                field_count +=1;
            }, 
            "ec" => { // Event type/class (TC, BE, QT, ... 
                ec = pair.1;
                field_count += 1;
            }, 
            "p1" => { // parameter 1
                p1 = pair.1;
                field_count += 1;
            }, 
            "p2" => { // parameter 2 - depends upon what ec is
                p2 = pair.1;
                field_count += 1;
            }, 
            "ts" => { // timestamp from the client
                let secs : i64 = pair.1.trim().parse().unwrap();
                ts = Utc.timestamp(secs,0);
                println!("Time: {:?}",ts);
                field_count += 1;
                println!("Timestamp = {:?}",ts)
            }, 
            "md5" => {  // md5 hashsum
                md5 = pair.1;
                field_count += 1;
            },
            "nonce" => {
                nonce = pair.1;
                field_count += 1;
            },
            "s1s" => {
                s1s = pair.1;
                field_count += 1;
            },
            _ => {
                println!("{:?} undefined {:?}",pair.0,pair.1);
            }
        }
        // debugging println!("Index: {:?} Pair: {:?} {:?}",i,pair.0,pair.1);
        i += 1;
    }

    // now lets log all this information to the eventlog table.
    // This is a file on disk in QMServer.  But we'll put it
    // on the database in the eventlog table

    // Check to make sure we got all the parameters
    let content = "bad parameters";
    if field_count != 18 {
        return Ok(
            HttpResponse::BadRequest()
                .content_type("text/html; charset=utf-8")
                .body(content)
        )
    }

    // now populate the Game
    let mut game = GameChangeset {
        org: "Nazarene".to_string(),
        tournament: tn.to_string(),
        division: dn.to_string(),
        room: rm.to_string(),
        round: rd.to_string(),
        key4server: Some(key.to_string()),
        ignore: Some(false),
        ruleset: "Nazarene".to_string()
    };

    // Now populate the quizzes event
    let mut quizevent = Quizzes {
        tdrri: tdrri,
        question: qn,
        eventnum: e,
        name: n.to_string(),
        team: t,
        quizzer: q,
        event: ec.to_string(),
        parm1: Some(p1.to_string()),
        parm2: Some(p2.to_string()),
        clientts: Some(ts),
        serverts: Some(Utc::now()),
        md5digest: Some(md5.to_string())
    };

    // now let's create an entry in the games table
    // Handle errors while we create the entry
    match models::scoreevent::create(&mut mdb, &game) {
        Ok(output) => {
            // update the quizevent tdrri so we have the correct one to write
            // the quizevent to the Quizzes table
            quizevent.tdrri = output.tdrri;
        },
        Err(e) => {
            println!("error ===>>> {:?}",e);
            match e {
               // the most likely cause here is a Unique constraint - the row
                // already exists in the database.  We'll ignore those and
                // panic or log the others
                DBError::DatabaseError(dbek,info) => match dbek {
                    UniqueViolation => {
                        // do nothing here.  This is a normal case when another event 
                        // comes in for this quiz.
                        println!("Loginfo => {:?}", info);
 //                       quizevent.tdrri = output.tdrri;
                    },
                    _ => {
                        // Okay this error is a database error but not a unique violation
                        log::error!("Line: {:?} DB Create error {:?} {:?} {:?}",line!(),dbek,info,game);
                    },
                },
                _ => {
                    // this is some error but not a database error
                    log::error!("Line: {:?} DB Create error {:?} {:?}",line!(),e,game);
                },
            };
        },
    };

    // let's print out the tdrri we got
//    log::info!("Line: {:?} TDRRI = {:?}",line!(),quiz.tdrri);
    
    let mut content = " it worked ";
   
    // now let's write an entry in the quizzes event table
    // Handle errors while we create the entry
    println!("inserted a games table entry");
    match models::scoreevent::createQuizEvent(&mut mdb, &quizevent) {
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

    let result = models::scoreevent::read_all(&mut mdb);
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

    let result = models::scoreevent::read_all(&mut db);

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

    let result = models::scoreevent::read(&mut db, item_id.into_inner());

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

    let result: Game = models::scoreevent::create(&mut db, &item).expect("Creation error");

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

    let result = models::scoreevent::update(&mut db, item_id.into_inner(), &item);

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

    let result = models::scoreevent::delete(&mut db, item_id.into_inner());

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
