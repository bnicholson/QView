use crate::diesel::*;
use crate::schema::*;

use create_rust_app::Connection;
use chrono::{Date,Utc};
use chrono::naive::NaiveDate;
use diesel::QueryResult;
use serde::{Deserialize, Serialize};
use crate::models::common::*;

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
    pub tdrri: String, 
    pub org: String,
    pub tournament: String,
    pub division: String,
    pub room: String,
    pub round: String,
    pub key4server: String,
    pub ignore: bool,
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
    pub key4server: String,
    pub ignore: bool,
    pub ruleset: String,
}

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
#[diesel(primary_key(tdrri, question, eventnum))]
pub struct Quizzes {
    pub tdrri: String, 
    pub question: i8,
    pub eventnum: i8,
    pub name: String,
    pub team: i8,
    pub quizzer: i8,
    pub event: String,
    pub parm1: String,
    pub parm2: String,
    pub ts: UTC,
    pub md5digest: String,
}

#[tsync::tsync]
#[derive(Debug, Serialize, Deserialize, Clone, Insertable, AsChangeset)]
#[diesel(table_name=Quizzes)]
pub struct QuizzesChangeset {   
    pub org: String,
    pub tournament: String,
    pub division: String,
    pub room: String,
    pub round: String,
    pub key4server: String,
    pub ignore: bool,
    pub ruleset: String,
}

pub fn create(db: &mut Connection, item: &GameChangeset) -> QueryResult<Game> {
    use crate::schema::games::dsl::*;

    insert_into(games).values(item).get_result::<Game>(db)
}

//pub fn read(db: &mut Connection, item_id: BigId) -> QueryResult<Game> {
//    use crate::schema::games::dsl::*;
//
//    games.filter(id.eq(item_id)).first::<Game>(db)
//}

//pub fn read_all(db: &mut Connection, pagination: &PaginationParams) -> QueryResult<Vec<Game>> {
//    use crate::schema::games::dsl::*;
//
//    let values = games
//        .order(created_at)
//        .limit(pagination.page_size)
//        .offset(
//            pagination.page
//                * std::cmp::max(pagination.page_size, PaginationParams::MAX_PAGE_SIZE as i64),
//        )
//        .load::<Game>(db);
//}

pub fn update(db: &mut Connection, item_id: BigId, item: &GameChangeset) -> QueryResult<Game> {
    use crate::schema::games::dsl::*;

    diesel::update(games.filter(id.eq(item_id)))
        .set(item)
        .get_result(db)
}

//pub fn delete(db: &mut Connection, item_id: BigId) -> QueryResult<usize> {
//    use crate::schema::games::dsl::*;
//
//    diesel::delete(games.filter(id.eq(item_id))).execute(db)
//}
