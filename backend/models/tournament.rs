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
#[diesel(table_name=tournaments)]
#[diesel(primary_key(tid))]
pub struct Tournament {
    #[diesel(sql_type = Integer)]
    pub tid: BigId, 
    pub organization: String,
    pub tname: String,                          // name of this tournament (humans)
    pub breadcrumb: String,
    pub fromdate: chrono::naive::NaiveDate,
    pub todate: chrono::naive::NaiveDate,
    pub venue: String,
    pub city: String,
    pub region: String,
    pub country: String,
    pub contact: String,
    pub contactemail: String,
    pub hide: bool,
    pub shortinfo : String,
    pub info: String,
    pub created_at: UTC,
    pub updated_at: UTC
}

#[tsync::tsync]
#[derive(Debug, Serialize, Deserialize, Clone, Insertable, AsChangeset)]
#[diesel(table_name=tournaments)]
#[diesel(primary_key(tid))]
pub struct TournamentChangeset {   
    pub organization: String,
    pub tname: String,
    pub breadcrumb: String,
    pub fromdate: chrono::naive::NaiveDate,
    pub todate: chrono::naive::NaiveDate,
    pub venue: String,
    pub city: String,
    pub region: String,
    pub country: String,
    pub contact: String,
    pub contactemail: Option<String>,
    pub hide: bool,
    pub info: Option<String>
}

pub fn create(db: &mut Connection, item: &TournamentChangeset) -> QueryResult<Tournament> {
    use crate::schema::tournaments::dsl::*;

    insert_into(tournaments).values(item).get_result::<Tournament>(db)
}

pub fn read(db: &mut Connection, item_id: BigId) -> QueryResult<Tournament> {
    use crate::schema::tournaments::dsl::*;

    tournaments.filter(tid.eq(item_id)).first::<Tournament>(db)
}

pub fn read_all(db: &mut Connection, pagination: &PaginationParams) -> QueryResult<Vec<Tournament>> {
    use crate::schema::tournaments::dsl::*;

    let values = tournaments
        .order(created_at)
        .limit(pagination.page_size)
        .offset(
            pagination.page
                * std::cmp::max(pagination.page_size, PaginationParams::MAX_PAGE_SIZE as i64),
        )
        .load::<Tournament>(db);
    println!("{:?}",values);
    values
}

pub fn update(db: &mut Connection, item_id: BigId, item: &TournamentChangeset) -> QueryResult<Tournament> {
    use crate::schema::tournaments::dsl::*;

    diesel::update(tournaments.filter(tid.eq(item_id)))
        .set(item)
        .get_result(db)
}

pub fn delete(db: &mut Connection, item_id: BigId) -> QueryResult<usize> {
    use crate::schema::tournaments::dsl::*;

    diesel::delete(tournaments.filter(tid.eq(item_id))).execute(db)
}
