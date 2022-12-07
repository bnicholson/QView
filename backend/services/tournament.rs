use actix_http::HttpMessage;
use actix_web::{delete, Error, get, HttpResponse, HttpRequest, post, put, Result, web::{Data, Json, Path, Query}};
use create_rust_app::Database;
use crate::{models, models::tournament::{Tournament, TournamentChangeset}};
use crate::models::common::*;
use chrono::{ Utc, TimeZone };
use crate::models::apicalllog::{apicalllog};
use utoipa::{ ToSchema, OpenApi };
use serde::{Serialize, Deserialize };
use diesel::{QueryResult};
use diesel::result::Error as DBError;

#[get("")]
async fn get_between_dates(
    db: Data<Database>,
    req: HttpRequest,
    Query(dinfo): Query<SearchDateParams>,
) -> HttpResponse {
    let mut db = db.pool.get().unwrap();

    // log this api call
    apicalllog(&req);

    // convert the query from the api call from timestamps in millis since 1970
    // to an actual 
    let from_dt = Utc.timestamp_millis(dinfo.from_date );
    let to_dt = Utc.timestamp_millis(dinfo.to_date);

    let result = models::tournament::read_between_dates(&mut db, dinfo.from_date, dinfo.to_date);

    if result.is_ok() {
        HttpResponse::Ok().json(result.unwrap())
    } else {
        HttpResponse::InternalServerError().finish()
    }
}
#[derive(OpenApi)]
#[openapi(paths(index))]
pub struct TournamentDoc;

#[utoipa::path(
        get,
        path = "/tournaments",
        responses(
            (status = 200, description = "Tournaments found successfully", body = Tournament),
            (status = 404, description = "Tournament not found")
        ),
        params(
            ("page" = u64, Path, description = "Page to read"),
            ("page_size" = u64, Path, description = "How many Tournaments to return")
        )
    )
]
#[get("")]
async fn index(
    db: Data<Database>,
    Query(info): Query<PaginationParams>,
) -> HttpResponse {
    let mut db = db.pool.get().unwrap();

    let result = models::tournament::read_all(&mut db, &info);

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
    let mut db = db.pool.get().unwrap();

    let result = models::tournament::read(&mut db, item_id.into_inner());

    if result.is_ok() {
        HttpResponse::Ok().json(result.unwrap())
    } else {
        HttpResponse::NotFound().finish()
    }
}

#[get("/today")]
async fn read_today(
    db: Data<Database>,
    req: HttpRequest,
) -> HttpResponse {
    let mut db = db.pool.get().unwrap();

    println!("Inside /api/tournaments/today");
    // log this api call
    apicalllog(&req);

    // convert the query from the api call from timestamps in millis since 1970
    // to an actual 
    let now = Utc::now();
    let from_dt = (now.timestamp()-(7*24*3600))*1000;
    let to_dt = (now.timestamp() + (7*24*3600))*1000;

    let result = models::tournament::read_between_dates(&mut db, from_dt, to_dt);
    println!("Results: {:?} {:?} {:?}", from_dt, to_dt, result);

    if result.is_ok() {
        HttpResponse::Ok().json(result.unwrap())
    } else {
        HttpResponse::InternalServerError().finish()
    }
}

#[tsync::tsync]
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TCS {   
    pub organization: Option<String>,
    pub tname: Option<String>,
    pub breadcrumb: Option<String>,
    pub fromdate: Option<chrono::naive::NaiveDate>,
    pub todate: Option<chrono::naive::NaiveDate>,
    pub venue: Option<String>,
    pub city: Option<String>,
    pub region: Option<String>,
    pub country: Option<String>,
    pub contact: Option<String>,
    pub contactemail: Option<String>,
    pub hide: Option<bool>,
    pub shortinfo: Option<String>,
    pub info: Option<String>
}

#[post("")]
async fn create(
    db: Data<Database>,
    req: HttpRequest,
    Json(item): Json<TournamentChangeset>    
) -> Result<HttpResponse, Error> {
    let mut db = db.pool.get().unwrap();

    println!("Inside tournement model create {:?}", item);
    
    let result : QueryResult<Tournament> = models::tournament::create(&mut db, &item);

    let response = process_response(result);

    Ok(HttpResponse::Created().json(response))
}

#[put("/{id}")]
async fn update(
    db: Data<Database>,
    item_id: Path<BigId>,
    Json(item): Json<TournamentChangeset>,
) -> HttpResponse {
    let mut db = db.pool.get().unwrap();

    let result = models::tournament::update(&mut db, item_id.into_inner(), &item);

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
    let mut db = db.pool.get().unwrap();

    let result = models::tournament::delete(&mut db, item_id.into_inner());

    if result.is_ok() {
        HttpResponse::Ok().finish()
    } else {
        HttpResponse::InternalServerError().finish()
    }
}

pub fn endpoints(scope: actix_web::Scope) -> actix_web::Scope {
    return scope
//        .service(index)
        .service(get_between_dates)
        .service(read_today)
        .service(read)
        .service(create)
        .service(update)
        .service(destroy);
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TournamentResult {
    code : i32,
    message: String,
    data : Option<Tournament>,
}


pub fn process_response(result : QueryResult<Tournament>) -> TournamentResult {

    let mut code = 200;
    let mut msg = "";
    let mut data : Option<Tournament> = None;
    let mut response = TournamentResult {
        code : 200,
        message : "".to_string(),
        data : None,
    };

    match result {
        Ok(output) => {
            println!("Create Tourney (output)-> {:?}",output);
            response.code = 200;
            response.message = "".to_string();
            response.data = Some(output);
        },
        Err(e) => {
            match e {
                DBError::DatabaseError(dbek,e) => {
                    match dbek {
                        UniqueViolation => {
                            response.code = 200;
                            response.message = "Duplicate Tournament".to_string();
                            println!("TOurnament create-> {:?}",e);
                        },
                        _ => {
                            response.code = 200;
                            response.message = "e".to_string();
                            println!("TOurnament create-> {:?}",e);
                        },
                    }
                },
                _x => {
                    response.code = 200;
                    response.message = "".to_string();         
                },
            }            
        }
    }    

    // return the result
    response
}