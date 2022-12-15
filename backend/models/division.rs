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
#[diesel(table_name=divisions)]
#[diesel(primary_key(did))]
pub struct Division {
//    #[diesel(sql_type = Integer)]
    pub did: BigId,                             // identifies the division
    pub tid: BigId,                             // id of the associated tournament
    pub dname: String,                          // Name of the division (human readable)
    pub breadcrumb: String,                     // used as part of short urls
    pub hide: bool,
    pub shortinfo : String,
    pub created_at: UTC,
    pub updated_at: UTC
}

#[tsync::tsync]
#[derive(Debug, Serialize, Deserialize, Clone, Insertable, AsChangeset)]
#[diesel(table_name=divisions)]
#[diesel(primary_key(did))]
pub struct DivisionChangeset {   
    pub dname: String,
    pub breadcrumb: String,
    pub hide: bool,
    pub shortinfo: Option<String>
}

pub fn create(db: &mut Connection, item: &DivisionChangeset) -> QueryResult<Division> {
    use crate::schema::divisions::dsl::*;

    insert_into(divisions).values(item).get_result::<Division>(db)
}

pub fn read(db: &mut Connection, item_id: BigId) -> QueryResult<Division> {
    use crate::schema::divisions::dsl::*;

    divisions.filter(tid.eq(item_id)).first::<Division>(db)
}

pub fn read_all(db: &mut Connection, pagination: &PaginationParams) -> QueryResult<Vec<Division>> {
    use crate::schema::divisions::dsl::*;

    let values = divisions
        .order(created_at)
        .filter(tid.eq(pagination.page_size))
        .limit(pagination.page_size)
        .offset(
            pagination.page
                * std::cmp::max(pagination.page_size, PaginationParams::MAX_PAGE_SIZE as i64),
        )
        .load::<Division>(db);
        values

}

pub fn update(db: &mut Connection, item_id: BigId, item: &DivisionChangeset) -> QueryResult<Division> {
    use crate::schema::divisions::dsl::*;

    diesel::update(divisions.filter(tid.eq(item_id)))
        .set(item)
        .get_result(db)
}

pub fn delete(db: &mut Connection, item_id: BigId) -> QueryResult<usize> {
    use crate::schema::divisions::dsl::*;

    diesel::delete(divisions.filter(tid.eq(item_id))).execute(db)
}
