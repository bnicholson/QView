use crate::diesel::*;
use crate::schema::*;
use create_rust_app::Connection;
use crate::models::common::*;
use serde::{Deserialize, Serialize};

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
#[diesel(table_name=games)]
#[diesel(primary_key(tdrri))]
pub struct Game {
    pub tdrri: BigId,
    pub org: String,
    pub tournament: String,
    pub division: String,
    pub room: String,
    pub round: String,
    pub key4server: Option<String>,
    pub ignore: Option<bool>,
    pub ruleset: String,
}

#[tsync::tsync]
#[derive(Debug, Serialize, Deserialize, Clone, Insertable, AsChangeset)]
#[diesel(table_name=games)]
#[diesel(primary_key(tdrri))]
pub struct GameChangeset {   
    pub org: String,
    pub tournament: String,
    pub division: String,
    pub room: String,
    pub round: String,
    pub key4server: Option<String>,
    pub ignore: Option<bool>,
    pub ruleset: String,
}

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

pub fn create(db: &mut Connection, item: &GameChangeset) -> QueryResult<Game> {
    use crate::schema::games::dsl::*;

    insert_into(games).values(item).get_result::<Game>(db)
}

pub fn createQuizEvent(db: &mut Connection, item: &Quizzes) -> QueryResult<Quizzes> {
    use crate::schema::quizzes::dsl::*;

    insert_into(quizzes).values(item).get_result::<Quizzes>(db)
}

pub fn read(db: &mut Connection, item_id: i64) -> QueryResult<Game> {
    use crate::schema::games::dsl::*;

    games.filter(tdrri.eq(item_id)).first::<Game>(db)
}

pub fn read_all(db: &mut Connection) -> QueryResult<Vec<Game>> {
    use crate::schema::games::dsl::*;

    games
        .order(tdrri)
        .limit(10)
        .offset(44)
        .load::<Game>(db)
}

pub fn update(db: &mut Connection, item_id: i64, item: &GameChangeset) -> QueryResult<Game> {
    use crate::schema::games::dsl::*;

    diesel::update(games.filter(tdrri.eq(item_id)))
        .set(item)
        .get_result(db)
}

pub fn delete(db: &mut Connection, item_id: i64) -> QueryResult<usize> {
    use crate::schema::games::dsl::*;

    diesel::delete(games.filter(tdrri.eq(item_id))).execute(db)
}
