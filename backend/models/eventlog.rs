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
pub struct Eventlog {
    pub created_at: UTC,                                            // used to ensure we have a unique timestamp to the millisecond    
    pub eid: BigId,                                                 // event identifier (unique) -- also ensure all events are unique
    pub key4server: String,                                          // what key/client did this come from
    pub tournament: String,                                          // tournament
    pub division: String,                                            // division
    pub room: String,                                                // room
    pub round: String,                                               // round
    pub question: i32,                                               // question
    pub eventnum: i32,                                               // event number
    pub name: String,                                                // name of the quizzer or team
    pub team: i32,                                                   // team # (0-2)
    pub quizzer: i32,                                                // quizzer (0-4)
    pub event: String,                                               // event (TC, BE, ...)
    pub parm1: String,                                               // parameter used by a specific event
    pub parm2: String,                                               // another one
    pub ts: String,                                                  // timestamp from the clients viewpoint
    pub host: String,                                                // host
    pub md5digest: String,                                           // used to ensure we don't have corruption in transmission
    pub nonce: String,                                               // part of the corruption avoidance 
    pub s1s: String,                                                 //  
};

pub fn create(db: &mut Connection, item: &DivisionChangeset) -> QueryResult<Division> {
    use crate::schema::divisions::dsl::*;

    insert_into(divisions).values(item).get_result::<Division>(db)
}

