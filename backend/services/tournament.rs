use actix_web::{delete, Error, get, HttpResponse, HttpRequest, post, put, Result, web::{Data, Json, Path, Query}};
use create_rust_app::Database;
use crate::{models, models::tournament::{Tournament, TournamentChangeset}};
use crate::models::common::*;
use chrono::{ Utc, TimeZone };
use crate::models::apicalllog::{apicalllog};


#[get("")]
async fn index_bydate(
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

    log::error!("UTC Timestamp = {:?} {:?} ",from_dt, to_dt);
    let result = models::tournament::read_bydate(&mut db, dinfo.from_date, dinfo.to_date);

    if result.is_ok() {
        HttpResponse::Ok().json(result.unwrap())
    } else {
        HttpResponse::InternalServerError().finish()
    }
}

//#[get("")]
//async fn index(
//    db: Data<Database>,
//    Query(info): Query<PaginationParams>,
//) -> HttpResponse {
//    let mut db = db.pool.get().unwrap();
//
//    let result = models::tournament::read_all(&mut db, &info);
//
//    if result.is_ok() {
//        HttpResponse::Ok().json(result.unwrap())
//    } else {
//        HttpResponse::InternalServerError().finish()
//    }
//}

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

#[post("")]
async fn create(
    db: Data<Database>,
    Json(item): Json<TournamentChangeset>,
) -> Result<HttpResponse, Error> {
    let mut db = db.pool.get().unwrap();

    let result: Tournament = models::tournament::create(&mut db, &item).expect("Creation error");

    Ok(HttpResponse::Created().json(result))
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
        .service(index_bydate)
        .service(read)
        .service(create)
        .service(update)
        .service(destroy);
}
