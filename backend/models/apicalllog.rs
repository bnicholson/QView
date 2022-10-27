use std::fmt;
use crate::diesel::*;
use crate::schema::*;
use create_rust_app::Connection;
use create_rust_app::Database;
use serde::{Deserialize, Serialize};
use crate::models::common::*;
use actix_web::{delete, HttpRequest, Error, get, HttpResponse, post, put, Result, web::{Data, Json, Path}};

// Okay.  We only write entries to this table.  It's used to emergencies
// and debugging.   We will eventually start removing items that are older than
// three years.  Okay, maybe not.  This could also be a very useful table to 
// allow us to test things.   Hmm, maybe I need another table that tracks
// every single API call.   That would be even better.

#[tsync::tsync]
#[derive( Debug, Serialize, Deserialize, Clone, Queryable, Insertable, Identifiable, AsChangeset,)]
#[diesel(table_name=apicalllog)]
#[diesel(primary_key(apicallid))]
pub struct ApiCalllog {
    pub created_at: UTC,                                            // used to ensure we have a unique timestamp to the millisecond    
    pub apicallid: BigId,                                           // apicall log identifier (unique) -- also ensure all events are unique
    pub method: String,                                             // What method was called
    pub uri: String,
    pub version: String,
    pub headers: String
}

#[tsync::tsync]
#[derive(Debug, Serialize, Deserialize, Clone, Insertable, AsChangeset)]
#[diesel(table_name=apicalllog)]
#[diesel(primary_key(apicallid))]
pub struct ApiCalllogChangeset {   
    pub method: String,
    pub uri: String,
    pub version: String,
    pub headers: String
}

pub fn apicalllog(req: &HttpRequest) {
    use crate::schema::apicalllog::dsl::*;
    
    // grab the database
    let appdb = req.app_data::<Data<Database>>().unwrap();
    let mut db = appdb.pool.get().unwrap();

    //    print_type_of(&mdb);
//    println!("Method: {:?}",req.method()); 
//    println!("URI: {:?}",req.uri()); 
//    println!("Version: {:?}",req.version()); 
//    println!("Headers: {:?}",req.headers());
//    println!("Match_info: {:?}",req.match_info());    
//    println!("Peer_address {:?}",req.peer_addr());
//    println!("URI: {:?}",req.uri()); 
//    println!("Path: {:?}",req.path()); 
//    println!("URI: {:?}",req.uri()); 
//    println!("Query_string: {:?}",req.query_string()); 
//    println!("Cookies: {:?}", req.cookies());
// the following aren't working
   // println!("Content-type: {:?}",req.content_type());
  //  println!("Encoding: {:?}",req.encoding());
 //   println!("Mime-type: {:?}",req.mime_type());
//    println!("Body (content): {:?}",req.body());
    // Now populate the quizzes event
    
    let item = ApiCalllogChangeset {
        method: req.method().to_string(),
        uri: req.uri().to_string(),
        version: version2str(req.version()),
        headers: headers2str(&req.headers())
    };

    insert_into(apicalllog).values(item).get_result::<ApiCalllog>(&mut db).expect("API CallLog Insert error");
}

#[allow(non_snake_case)]
#[allow(unused_variables)]
fn version2str(version: actix_web::http::Version) -> String {
    match version {
        HTTP_09 => "HTTP/0.9".to_string(),
        HTTP_10 => "HTTP/1.0".to_string(),
        HTTP_11 => "HTTP/1.1".to_string(),
        HTTP_2 =>  "HTTP/2.0".to_string(),
        HTTP_3 =>  "HTTP/3.0".to_string(),
        _ => unreachable!(),
    }
}

fn headers2str(headers: &actix_web::http::header::HeaderMap) -> String {
    "headers".to_string()
}

