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
    pub sid: BigId,
    pub tid: BigId,
    pub roundtime: UTC,
    pub org: String,
    pub tournament: String,
    pub division: String,
    pub room: String,
    pub round: String,
    pub team1: String,
    pub team2: String,
    pub team3: String,
    pub quizmaster: String,
    pub contentjudge: String,
    pub scorekeeper: String,
    pub stats: String,
}

#[tsync::tsync]
#[derive(Debug, Serialize, Deserialize, Clone, Insertable, AsChangeset)]
#[diesel(table_name=schedules)]
#[diesel(primary_key(sid))]
pub struct ScheduleChangeset {   
    pub roundtime: UTC,
    pub org: String,
    pub tournament: String,
    pub division: String,
    pub room: String,
    pub round: String,
    pub team1: String,
    pub team2: String,
    pub team3: String,
    pub quizmaster: String,
    pub contentjudge: String,
    pub scorekeeper: String,
    pub stats: String,
}

pub fn empty_changeset() -> ScheduleChangeset {
    return ScheduleChangeset {   
        roundtime: Utc.now(),
        org: "".to_string(),
        tournament: "".to_string(),
        division: "".to_string(),
        room: "".to_string(),
        round: "".to_string(),
        team1: "".to_string(),
        team2: "".to_string(),
        team3: "".to_string(),
        quizmaster: "".to_string(),
        contentjudge: "".to_string(),
        scorekeeper: "".to_string(),
        stats: "".to_string(),
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
        .koffset(44)
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
