use crate::diesel::*;
use crate::schema::*;

use create_rust_app::Connection;
use diesel::QueryResult;
use serde::{Deserialize, Serialize};
use crate::models::common::*;

// Okay.  We only write entries to this table.  It's used to emergencies
// and debugging.   We will eventually start removing items that are older than
// three years.  Okay, maybe not.  This could also be a very useful table to 
// allow us to test things.   Hmm, maybe I need another table that tracks
// every single API call.   That would be even better.

#[tsync::tsync]
#[derive( Debug, Serialize, Deserialize, Clone, Queryable, Insertable, Identifiable, AsChangeset,)]
#[diesel(table_name=eventlog)]
#[diesel(primary_key(did))]
pub struct ApiCalllog {
    pub created_at: UTC,                                            // used to ensure we have a unique timestamp to the millisecond    
    pub apicallid: BigId,                                           // apicall log identifier (unique) -- also ensure all events are unique
    pub method: String
}

pub fn apicalllog(db: &mut Connection, HttpRequest: req) {
    use crate::schema::apicalllog::dsl::*;

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
   // println!("Content-type: {:?}",req.content_type());
  //  println!("Encoding: {:?}",req.encoding());
 //   println!("Mime-type: {:?}",req.mime_type());
//    println!("Body (content): {:?}",req.body());

    insert_into(divisions).values(item).get_result::<Division>(db)
}

pub fn create(db: &mut Connection, item: &DivisionChangeset) -> QueryResult<Division> {
    use crate::schema::divisions::dsl::*;

    insert_into(divisions).values(item).get_result::<Division>(db)
}

