use crate::diesel::*;
use crate::schema::*;
use create_rust_app::Connection;
use crate::models::common::*;
use serde::{Deserialize, Serialize};

#[tsync::tsync]
#[derive(Debug, Serialize, Deserialize, Clone, Queryable, Insertable, Identifiable, AsChangeset)]
#[diesel(table_name=games)]
#[diesel(primary_key(gid))]
pub struct Game {
    pub gid: BigId,
    pub org: String,
    pub tournament: String,
    pub division: String,
    pub room: String,
    pub round: String,
    pub clientkey: String,
    pub ignore: bool,
    pub ruleset: String,
}

#[tsync::tsync]
#[derive(Debug, Serialize, Deserialize, Clone, Insertable, AsChangeset)]
#[diesel(table_name=games)]
#[diesel(primary_key(gid))]
pub struct GameChangeset {   
    pub org: String,
    pub tournament: String,
    pub division: String,
    pub room: String,
    pub round: String,
    pub clientkey: String,
    pub ignore: bool,
    pub ruleset: String,
}

pub fn empty_changeset() -> GameChangeset {
    return GameChangeset {   
        org: "".to_string(),
        tournament: "".to_string(),
        division: "".to_string(),
        room: "".to_string(),
        round: "".to_string(),
        clientkey: "".to_string(),
        ignore: false,
        ruleset: "".to_string()
    }
}

pub fn create(db: &mut Connection, item: &GameChangeset) -> QueryResult<Game> {
    use crate::schema::games::dsl::*;

    insert_into(games).values(item).get_result::<Game>(db)
}

pub fn read(db: &mut Connection, item_id: i64) -> QueryResult<Game> {
    use crate::schema::games::dsl::*;

    games.filter(gid.eq(item_id)).first::<Game>(db)
}

pub fn read_all(db: &mut Connection) -> QueryResult<Vec<Game>> {
    use crate::schema::games::dsl::*;

    games
        .order(gid)
        .limit(10)
        .offset(44)
        .load::<Game>(db)
}

pub fn update(db: &mut Connection, item_id: i64, item: &GameChangeset) -> QueryResult<Game> {
    use crate::schema::games::dsl::*;

    diesel::update(games.filter(gid.eq(item_id)))
        .set(item)
        .get_result(db)
}

pub fn delete(db: &mut Connection, item_id: i64) -> QueryResult<usize> {
    use crate::schema::games::dsl::*;

    diesel::delete(games.filter(gid.eq(item_id))).execute(db)
}

// Construct a key for the game information.
// we will use this to retrieve any information we have
// on this particular game.  
pub fn get_gid_from_cache(game: &GameChangeset) -> BigId {
    let gamekey = format!("QV:GAME:{}:{}:{}:{}:{}:{}",game.org,game.tournament, game.division, game.room, game.round, game.clientkey);
    println!("gamekey = {:?}",gamekey);

    let client = redis::Client::open("redis://127.0.0.1/").unwrap();
    let mut con = client.get_connection().unwrap();

    // Now lets read the cache to see if we have this entry.
    match redis::cmd("get").arg(&gamekey).query::<Option<String>>(&mut con) {
        Ok(nil) => {
            return -1;   // not found
        },
        Ok(json) => {
            let json_str : String = json.unwrap();
            let info : Game = serde_json::from_str(&json_str).unwrap(); 
            return info.gid;
        },
        Err(e) => {
            log::error!("{} {} Fault retrieving redis cache for game {:?}",module_path!(),line!(),e);
            return -1 ;   // not found
        },
    }

    // I have no idea how we got here
    -1
}