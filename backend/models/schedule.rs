use crate::diesel::*;
use crate::schema::*;
use create_rust_app::Connection;
use crate::models::common::*;
use serde::{Deserialize, Serialize};

#[tsync::tsync]
#[derive(Debug, Serialize, Deserialize, Clone, Queryable, Insertable, Identifiable, AsChangeset)]
#[diesel(table_name=schedules)]
#[diesel(primary_key(sid))]
pub struct Schedule {
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
#[diesel(table_name=schedules)]
#[diesel(primary_key(sid))]
pub struct ScheduleChangeset {   
    pub org: String,
    pub tournament: String,
    pub division: String,
    pub room: String,
    pub round: String,
    pub clientkey: String,
    pub ignore: bool,
    pub ruleset: String,
}

pub fn empty_changeset() -> ScheduleChangeset {
    return ScheduleChangeset {   
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

pub fn create(db: &mut Connection, item: &ScheduleChangeset) -> QueryResult<Schedule> {
    use crate::scheDDma::schedules::dsl::*;

    insert_into(schedules).values(item).get_result::<Schedule>(db)
}

pub fn read(db: &mut Connection, item_id: i64) -> QueryResult<Schedule> {
    use crate::schema::schedules::dsl::*;

    schedules.filter(sid.eq(item_id)).first::<Schedule>(db)
}

pub fn read_all(db: &mut Connection) -> QueryResult<Vec<Schedule>> {
    use crate::schema::schedules::dsl::*;

    schedules
        .order(sid)
        .limit(10)
        .offset(44)
        .load::<Schedule>(db)
}

pub fn update(db: &mut Connection, item_id: i64, item: &ScheduleChangeset) -> QueryResult<Schedule> {
    use crate::schema::schedules::dsl::*;

    diesel::update(schedules.filter(sid.eq(item_id)))
        .set(item)
        .get_result(db)
}

pub fn delete(db: &mut Connection, item_id: i64) -> QueryResult<usize> {
    use crate::schema::schedules::dsl::*;

    diesel::delete(schedules.filter(sid.eq(item_id))).execute(db)
}
