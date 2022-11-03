use crate::diesel::*;
use crate::schema::*;
use create_rust_app::Connection;
use crate::models::common::*;
use serde::{Deserialize, Serialize};

#[tsync::tsync]
#[derive(Debug, Serialize, Deserialize, Clone, Queryable, Insertable, Identifiable, AsChangeset)]
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

pub fn create(db: &mut Connection, item: &GameChangeset) -> QueryResult<Game> {
    use crate::schema::games::dsl::*;

    insert_into(games).values(item).get_result::<Game>(db)
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
