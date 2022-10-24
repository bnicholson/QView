
use actix_web::{delete, HttpRequest, Error, get, HttpResponse, post, put, Result, web::{Data, Json, Path}};
use create_rust_app::Database;
use crate::{models, models::scoreevent::{Game, GameChangeset}};
use crate::models::common::*;
use qstring::QString;

pub async fn write(
    req: HttpRequest,
) -> actix_web::Result<HttpResponse> {
    let db = req.app_data::<Data<Database>>().unwrap();
    let mut mdb = db.pool.get().unwrap();

    print_type_of(&mdb);
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
    
    let qs = qstring::QString::from(req.query_string());
    let ps = qs.to_pairs();
    println!("Pairs: {:?}",ps);
    let psiter = ps.iter();
    let mut i = 0;
    for pair in psiter {
        println!("Index: {:?} Pair: {:?}",i,pair);
        i += 1;
    }

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
