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

pub fn create(db: &mut Connection, item: &GameChangeset) -> QueryResult<Game> {
    use crate::schema::games::dsl::*;

    insert_into(games).values(item).get_result::<Game>(db)
}

pub fn read(db: &mut Connection, item_id: String) -> QueryResult<Game> {
    use crate::schema::games::dsl::*;

    games.filter(tdrri.eq(item_id)).first::<Game>(db)
}

pub fn read_all(db: &mut Connection, pagination: &PaginationParams) -> QueryResult<Vec<Game>> {
    use crate::schema::games::dsl::*;

    let values = games
        .order(tdrri)
        .limit(pagination.page_size)
        .offset(
            pagination.page
                * std::cmp::max(pagination.page_size, PaginationParams::MAX_PAGE_SIZE as i64),
        )
        .load::<Game>(db);
}

pub fn update(db: &mut Connection, item_id: String, item: &GameChangeset) -> QueryResult<Game> {
    use crate::schema::games::dsl::*;

    diesel::update(games.filter(tdrri.eq(item_id)))
        .set(item)
        .get_result(db)
}

pub fn delete(db: &mut Connection, item_id: String) -> QueryResult<usize> {
    use crate::schema::games::dsl::*;

    diesel::delete(games.filter(tdrri.eq(item_id))).execute(db)
}
