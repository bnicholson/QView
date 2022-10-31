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
#[diesel(primary_key(evid))]
pub struct Eventlog {
    pub evid: BigId,                                                 // event identifier (unique) -- also ensure all events are unique
    pub created_at: UTC,                                            // used to ensure we have a unique timestamp to the millisecond    
    pub clientkey: String,                                          // what key/client did this come from
    pub organization: String,                                       // what org sent this
    pub bldgroom: String,                                           // what building is the room in
    pub tournament: String,                                         // tournament
    pub division: String,                                           // division
    pub room: String,                                               // room
    pub round: String,                                              // round
    pub question: i32,                                              // question
    pub eventnum: i32,                                              // event number
    pub name: String,                                               // name of the quizzer or team
    pub team: i32,                                                  // team # (0-2)
    pub quizzer: i32,                                               // quizzer (0-4)
    pub event: String,                                              // event (TC, BE, ...)
    pub parm1: String,                                              // parameter used by a specific event
    pub parm2: String,                                              // another one
    pub ts: String,                                                 // timestamp from the clients viewpoint
    pub clientip: String,                                           // client ip address 
    pub md5digest: String,                                          // used to ensure we don't have corruption in transmission
    pub nonce: String,                                              // part of the corruption avoidance 
    pub s1s: String,                                                // sha1hashsum -- ensures   
}

#[tsync::tsync]
#[derive( Debug, Serialize, Deserialize, Clone, Queryable, Insertable, Identifiable, AsChangeset,)]
#[diesel(table_name=eventlog)]
#[diesel(primary_key(evid))]
pub struct EventlogChangeset {
    pub clientkey: String,                                          // what key/client did this come from
    pub organization: String,                                       // what org sent this
    pub bldgroom: String,                                           // what building is the room in    
    pub tournament: String,                                         // tournament
    pub division: String,                                           // division
    pub room: String,                                               // room
    pub round: String,                                              // round
    pub question: i32,                                              // question
    pub eventnum: i32,                                              // event number
    pub name: String,                                               // name of the quizzer or team
    pub team: i32,                                                  // team # (0-2)
    pub quizzer: i32,                                               // quizzer (0-4)
    pub event: String,                                              // event (TC, BE, ...)
    pub parm1: String,                                              // parameter used by a specific event
    pub parm2: String,                                              // another one
    pub ts: String,                                                 // timestamp from the clients viewpoint
    pub clientip: String,                                           // clientip
    pub md5digest: String,                                          // used to ensure we don't have corruption in transmission
    pub nonce: String,                                              // part of the corruption avoidance 
    pub s1s: String,                                                // sha1hashsum -- ensures   
}

// 
//
//
pub fn write_eventlog(db: &mut Connection, org: String, bldgroom: String, ck: String, tk: String, tn:  String, dn:  String, rm: String,
    rd: String, question: i32, eventnum: i32, name: String, team: i32, quizzer: i32, event: String, 
    parm1: String, parm2: String, ts: String, cip: String, md5digest: String, nonce: String, s1s: String
    ) -> QueryResult<Eventlog> {
    let entry = EventlogChangeset {
        clientkey: ck,                                              // what key/client did this come from
        organization: org,                                          // organization
        bldgroom: bldgroom,                                         // what building 
        tournament: tn,                                             // tournament
        division: dn,                                               // division
        room: rm,                                                   // room
        round: rd,                                                  // round
        question: question,                                         // question
        eventnum: eventnum,                                         // event number
        name: name,                                                 // name of the quizzer or team
        team: team,                                                 // team # (0-2)
        quizzer: quizzer,                                           // quizzer (0-4)
        event: event,                                               // event (TC, BE, ...)
        parm1: parm1,                                               // parameter used by a specific event
        parm2: parm2,                                               // another one
        ts: ts,                                                     // timestamp from the clients viewpoint
        clientip: cip,                                              // host
        md5digest: md5digest,                                       // used to ensure we don't have corruption in transmission
        nonce: nonce,                                               // part of the corruption avoidance 
        s1s: s1s,                                                   // sha1sum - validation we don't have corrupted data    
    };

    // now write the eventlog entry
    create(db, &entry);
}

pub fn create(db: &mut Connection, item: &EventlogChangeset) -> QueryResult<Eventlog> {
    use crate::schema::eventlog::dsl::*;

    insert_into(eventlog).values(item).get_result::<Eventlog>(db)
}

