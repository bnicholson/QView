use actix_web::{delete, web, HttpRequest, Error, get, HttpResponse, post, put, Result, web::{Data, Json, Path, Query}};
use create_rust_app::Database;
use crate::{models, models::scoreevent::{Game, GameChangeset}};
use crate::models::common::*;
use actix_web::middleware::Logger;
use uuid::Uuid;


#[get("")]
async fn index(
    db: Data<Database>,
//    Query(info): Query<PaginationParams>,
//    info: web::Path<Info>,
//    path: web::Path<(String,String,String)>,
    req: HttpRequest,
) -> HttpResponse {

    let mut db = db.pool.get().unwrap();
    
    println!("Method: {:?}",req.method()); 
    println!("URI: {:?}",req.uri()); 
    println!("Version: {:?}",req.version());     
    println!("URI: {:?}",req.uri()); 
    println!("Path: {:?}",req.path()); 
    println!("URI: {:?}",req.uri()); 
    println!("Query_string: {:?}",req.query_string()); 

//    let info = web::Path<(String,String,String)>;
//    println!("Index endpoint - {} {} {}",info.bldgroom,info.tn,info.dn);

//    let (bldgroom, tn, dn) = path.into_inner();

//    println!("bldgroom = {:?}",bldgroom);/
//    println!("tn = {:?}",tn);
//    println!("dn = {:?}",dn);

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
    item_id: Path<Uuid>,
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
    item_id: Path<Uuid>,
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
    item_id: Path<Uuid>,
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
