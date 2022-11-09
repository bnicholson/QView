
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

    log::info!("Inside pingmsg");

    // log this api call
    apicalllog(&req);

    // let's create the roominfo structure and start filling it in
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
                roominfo_entry.bldgroom = pair.1.replace("+"," ");
                field_count += 1;               
            },
            "key" => {  // key4server - uniquely identifies a particular client
                roominfo_entry.clientkey = pair.1.replace("+"," ");
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
                roominfo_entry.tournament = pair.1.replace("+"," ");
                field_count += 1;
            },
            "dn" => { // Division Name
                roominfo_entry.division = pair.1.replace("+"," ");
                field_count += 1;
            },
            "rm" => { // Room 
                roominfo_entry.room = pair.1.replace("+"," ");
                field_count += 1;
            },
            "rd" => { // Round
                roominfo_entry.round = pair.1.replace("+"," ");
                field_count += 1;
            }, 
            "qn" => { // Question #
                roominfo_entry.question = pair.1.trim().parse().unwrap();
                field_count += 1;
            },
            "ts" => { // timestamp from the client
                let secs : i64 = pair.1.trim().parse().unwrap();
                ts = Utc.timestamp(secs,0);
                field_count += 1;
            }, 
            "qmv" => {
                roominfo_entry.qm_version = pair.1.trim().to_string();
                field_count += 1;
            },
            "myip" => {
                // this is optional should only be there sometimes.
                let tmp = pair.1.replace("+"," ");
                roominfo_entry.clientip = tmp.to_string();
            }
            _ => {
                log::error!("{:?} {:?} Invalid parameter received in /scoreevent api call {:?} ",module_path!(),line!(),
                    pair);
            }
        }
    }

    // Check to make sure we got all the parameters
    let content = "bad parameters";
    if field_count != 10 {
        return Ok(
            HttpResponse::BadRequest()
                .content_type("text/html; charset=utf-8")
                .body(content)
        )
    }

    // now grab the result of the sha1hashing
	log::info!("{:?} {:?} PingMsg: Org: {} BldgRoom: {}, Key: {}, Tk: {}, TN: {}, DN: {}, Room: {}, Round: {}, Question: {}, Timestamp: {}, Client IP: {}",
        module_path!(),line!(), org, &roominfo_entry.bldgroom, &roominfo_entry.clientkey, tk, &roominfo_entry.tournament, &roominfo_entry.division, 
        &roominfo_entry.room, &roominfo_entry.round, &roominfo_entry.question, ts, &roominfo_entry.clientip);   
    
    // send an update to the cache for this room.  Rounds in  Progress (tickertape)
    update_roominfo(&mut roominfo_entry,0);

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
