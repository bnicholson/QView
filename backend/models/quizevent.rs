use crate::diesel::*;
use crate::schema::*;
use create_rust_app::Connection;
use crate::models::common::*;
use serde::{Deserialize, Serialize};

// Now define the tables that will store each quiz event
#[tsync::tsync]
#[derive(
    Debug,
    Serialize,
    Deserialize,
    Clone,
    Queryable,
    Insertable,
    Identifiable,
    AsChangeset,
)]
#[diesel(table_name=quizzes)]
#[diesel(primary_key(tdrri,question,eventnum))]
pub struct Quizzes {
    pub tdrri: BigId,
    pub question: i32,
    pub eventnum: i32,
    pub name: String,
    pub team: i32,
    pub quizzer: i32,
    pub event: String,
    pub parm1: Option<String>,
    pub parm2: Option<String>,
    pub clientts: Option<UTC>,
    pub serverts: Option<UTC>,
    pub md5digest: Option<String>,
}

#[tsync::tsync]
#[derive(Debug, Serialize, Deserialize, Clone, Insertable, AsChangeset)]
#[diesel(table_name=quizzes)]
#[diesel(primary_key(tdrri,question,eventnum))]
pub struct QuizzesChangeset {   
    pub name: String,
    pub team: i32,
    pub quizzer: i32,
    pub event: String,
    pub parm1: Option<String>,
    pub parm2: Option<String>,
    pub clientts: Option<UTC>,
    pub serverts: Option<UTC>,
    pub md5digest: Option<String>,  
}




pub fn create_quiz_event(db: &mut Connection, item: &Quizzes) -> QueryResult<Quizzes> {
    use crate::schema::quizzes::dsl::*;

    insert_into(quizzes).values(item).get_result::<Quizzes>(db)
}
