use actix_web::{delete, Error, get, HttpResponse, HttpRequest, post, put, Result, web::{Data, Json, Path, Query}};
use create_rust_app::Database;
use crate::models::roominfo::{ get_roominfo };
use crate::models::common::*;
use chrono::{ Utc, TimeZone };
use crate::models::apicalllog::{apicalllog};

#[get("")]
async fn index(
//    Query(info): Query<PaginationParams>,
) -> HttpResponse {

    let result = get_roominfo();

    if result.is_ok() {
        HttpResponse::Ok().json(result.unwrap())
    } else {
        HttpResponse::InternalServerError().finish()
    }
}

#[get("/{id}")]
async fn read(
    item_id: Path<BigId>,
) -> HttpResponse {
//    let result = models::ament::read(&mut db, item_id.into_inner());
let result = get_roominfo();
//    if result.is_ok() {
//        HttpResponse::Ok().json(result.unwrap())
//    } else {
//        HttpResponse::NotFound().finish()
//    }
    HttpResponse::Ok().json(result.unwrap())
}

pub fn endpoints(scope: actix_web::Scope) -> actix_web::Scope {
    return scope
        .service(index);
}
