use crate::diesel::*;
use crate::schema::*;

use create_rust_app::Connection;
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
#[diesel(table_name=rooms)]
#[diesel(primary_key(roomid))]
pub struct Room {
    pub roomid: BigId,                          // identifies the room uniquely
    pub tid: BigId,                             // id of the associated tournament
    pub name: String,                           // Name of the room (human readable)
    pub building: String,                       // What is the building this room is in
    pub quizmaster: String,                     // Name of the quizmaster assigned to the room
    pub contentjudge : String,                  // name of the content judge
    pub comments: String,                       // Any comments about the room
}

#[tsync::tsync]
#[derive(Debug, Serialize, Deserialize, Clone, Insertable, AsChangeset)]
#[diesel(table_name=rooms)]
#[diesel(primary_key(roomid))]
pub struct RoomChangeset {   
    pub tid: BigId,                             // id of the associated tournament    
    pub name: String,                           // Name of the room (human readable)
    pub building: String,                       // What is the building this room is in
    pub quizmaster: String,                     // Name of the quizmaster assigned to the room
    pub contentjudge : String,                  // name of the content judge
    pub comments: String,                       // Any comments about the room
}

pub fn create(db: &mut Connection, item: &RoomChangeset) -> QueryResult<Room> {
    use crate::schema::rooms::dsl::*;

    insert_into(rooms).values(item).get_result::<Room>(db)
}

pub fn read(db: &mut Connection, item_id: BigId) -> QueryResult<Room> {
    use crate::schema::rooms::dsl::*;

    rooms.filter(roomid.eq(item_id)).first::<Room>(db)
}

pub fn read_all(db: &mut Connection, tournamentid: BigId) -> QueryResult<Vec<Room>> {
    use crate::schema::rooms::dsl::*;

    let values = rooms
        .order(name)
        .filter(tid.eq(tournamentid))
        .load::<Room>(db);
        values
}

pub fn update(db: &mut Connection, item_id: BigId, item: &RoomChangeset) -> QueryResult<Room> {
    use crate::schema::rooms::dsl::*;

    diesel::update(rooms.filter(roomid.eq(item_id)))
        .set(item)
        .get_result(db)
}

pub fn delete(db: &mut Connection, item_id: BigId) -> QueryResult<usize> {
    use crate::schema::rooms::dsl::*;

    diesel::delete(rooms.filter(roomid.eq(item_id))).execute(db)
}
