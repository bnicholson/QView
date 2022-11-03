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
#[diesel(table_name=eventlogs)]
#[diesel(primary_key(evid))]
pub struct Eventlog {
    pub evid: BigId,                                                // event identifier (unique) -- also ensure all events are unique
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
    pub s1s: String                                                 // sha1hashsum -- ensures   
}

#[tsync::tsync]
#[derive(Debug, Serialize, Deserialize, Clone, Insertable, AsChangeset)]
#[diesel(table_name=eventlogs)]
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
    pub s1s: String                                                 // sha1hashsum -- ensures   
}

// Create an empty eventlogchangeset
//
pub fn empty_changeset() -> EventlogChangeset {

    return EventlogChangeset {
            clientkey: "".to_string(),                                          // what key/client did this come from
            organization: "Nazarene".to_string(),                               // what org sent this - defaults to Nazarene for now
            bldgroom: "".to_string(),                                           // what building is the room in    
            tournament: "".to_string(),                                         // tournament
            division: "".to_string(),                                           // division
            room: "".to_string(),                                               // room
            round: "".to_string(),                                              // round
            question: 0,                                                        // question
            eventnum: 0,                                                        // event number
            name: "".to_string(),                                               // name of the quizzer or team
            team: -1,                                                           // team # (0-2)
            quizzer: 0,                                                         // quizzer (0-4)
            event: "".to_string(),                                              // event (TC, BE, ...)
            parm1: "".to_string(),                                              // parameter used by a specific event
            parm2: "".to_string(),                                              // another one
            ts: "".to_string(),                                                 // timestamp from the clients viewpoint
            clientip: "".to_string(),                                           // clientip
            md5digest: "".to_string(),                                          // used to ensure we don't have corruption in transmission
            nonce: "".to_string(),                                              // part of the corruption avoidance 
            s1s: "".to_string()                                                 // sha1hashsum -- ensures 
        }
}

// 
//
//
pub fn write_eventlog(db: &mut Connection, org: &String, bldgroom: &String, ck: &String, tk: &String, tn:  &String, dn:  &String, rm: &String,
    rd: &String, question: i32, eventnum: i32, name: &String, team: i32, quizzer: i32, event: &String, 
    parm1: &String, parm2: &String, ts: &String, cip: &String, md5digest: &String, nonce: &String, s1s: &String
    ) -> QueryResult<Eventlog> {
    let entry = EventlogChangeset {
        clientkey: ck.to_string(),                                  // what key/client did this come from
        organization: org.to_string(),                              // organization
        bldgroom: bldgroom.to_string(),                             // what building 
        tournament: tn.to_string(),                                 // tournament
        division: dn.to_string(),                                   // division
        room: rm.to_string(),                                       // room
        round: rd.to_string(),                                      // round
        question: question,                                         // question
        eventnum: eventnum,                                         // event number
        name: name.to_string(),                                     // name of the quizzer or team
        team: team,                                                 // team # (0-2)
        quizzer: quizzer,                                           // quizzer (0-4)
        event: event.to_string(),                                   // event (TC, BE, ...)
        parm1: parm1.to_string(),                                   // parameter used by a specific event
        parm2: parm2.to_string(),                                   // another one
        ts: ts.to_string(),                                         // timestamp from the clients viewpoint
        clientip: cip.to_string(),                                  // host
        md5digest: md5digest.to_string(),                           // used to ensure we don't have corruption in transmission
        nonce: nonce.to_string(),                                   // part of the corruption avoidance 
        s1s: s1s.to_string(),                                         // sha1sum - validation we don't have corrupted data    
    };
    // now write the eventlog entry
    create(db, &entry)
}

pub fn create(db: &mut Connection, item: &EventlogChangeset) -> QueryResult<Eventlog> {
    use crate::schema::eventlogs::dsl::*;

    insert_into(eventlogs).values(item).get_result::<Eventlog>(db)
}

