use crate::models::tournament::{Tournament, TournamentChangeset};
use crate::models::*;
use crate::models::common::*;
//use crate::Pool;

use actix_web::{delete, get, post, put, Error as AWError};
use actix_web::{web, HttpResponse};

#[get("")]
async fn index(
  pool: web::Data<Pool>,
  web::Query(info): web::Query<PaginationParams>
) -> Result<HttpResponse, AWError> {
  let db = pool.get().unwrap();

  Ok(Tournament::read_all(&db, &info)
    .map(|items| HttpResponse::Ok().json(items))
    .map_err(|_| HttpResponse::InternalServerError())?)
}

#[get("/{id}")]
async fn read(
  pool: web::Data<Pool>,
  web::Path(item_id): web::Path<ID>
) -> Result<HttpResponse, AWError> {
  let db = pool.get().unwrap();

  Ok(Tournament::read(&db, item_id)
    .map(|item| HttpResponse::Found().json(item))
    .map_err(|_| HttpResponse::NotFound())?)
}

#[post("")]
async fn create(
  pool: web::Data<Pool>,
  web::Json(item): web::Json<TournamentChangeset>
) -> Result<HttpResponse, AWError> {
  let db = pool.get().unwrap();

  Ok(Tournament::create(&db, &item)
    .map(|item| HttpResponse::Created().json(item))
    .map_err(|_| HttpResponse::InternalServerError())?)
}

#[put("/{id}")]
async fn update(
  pool: web::Data<Pool>,
  web::Path(item_id): web::Path<ID>,
  web::Json(item): web::Json<TournamentChangeset>
) -> Result<HttpResponse, AWError> {
  let db = pool.get().unwrap();

  Ok(Tournament::update(&db, item_id, &item)
    .map(|item| HttpResponse::Ok().json(item))
    .map_err(|_| HttpResponse::InternalServerError())?)
}

#[delete("/{id}")]
async fn destroy(
    pool: web::Data<Pool>,
    web::Path(item_id): web::Path<ID>,
) -> Result<HttpResponse, AWError> {
    let db = pool.get().unwrap();

    Ok(Tournament::delete(&db, item_id)
        .map(|_| HttpResponse::Ok().finish())
        .map_err(|_| HttpResponse::InternalServerError().finish())?)
}


pub fn endpoints(scope: actix_web::Scope) -> actix_web::Scope {
  return scope
    .service(index)
    .service(read)
    .service(create)
    .service(update)
    .service(destroy);
}
