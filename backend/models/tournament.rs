use crate::schema::*;
use crate::diesel::*;

use diesel::QueryResult;
use serde::{Serialize, Deserialize};
use crate::models::*;
use crate::DB;

#[tsync::tsync]
#[derive(Debug, Serialize, Deserialize, Clone, Queryable, Insertable, Identifiable, AsChangeset)]
#[diesel(table_name=tournaments)]
pub struct Tournament {
  /* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
     Add columns here in the same order as the schema
     (because #[derive(Queryable)] expects this)
     -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
  // pub id: ID,
  // pub created_at: UTC,
  // pub updated_at: UTC,
  pub id: ID, 
  pub organization: String,
  pub tournament: String,
  pub fromdate: UTC,
  pub todate: UTC,
  pub venue: String,
  pub city: String,
  pub region: String,
  pub country: String,
  pub contact: String,
  pub contactemail: String,
  pub hide: bool,
  pub info: String,
  pub created_at: UTC,
  pub updated_at: UTC
}

#[tsync::tsync]
#[derive(Debug, Serialize, Deserialize, Clone, Insertable, AsChangeset)]
#[diesel(table_name=tournaments)]
pub struct TournamentChangeset {
  /* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
     Don't include non-mutable columns
     (ex: id, created_at/updated_at)
     -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
     pub organization: String;
     pub tournament: String;
     pub fromdate: UTC;
     pub todate: UTC;
     pub venue: String;
     pub city: String;
     pub region: String;
     pub country: String;
     pub contact: String;
     pub contactemail: String;
     pub hide: bool;
     pub info: String;
}

impl Tournament {
  pub fn create(db: &DB, item: &TournamentChangeset) -> QueryResult<Self> {
      use crate::schema::tournaments::dsl::*;
      
      insert_into(tournaments)
      .values(item)
      .get_result::<Tournament>(db)
  }
  
  pub fn read(db: &DB, item_id: ID) -> QueryResult<Self> {
      use crate::schema::tournaments::dsl::*;
      
      tournaments.filter(id.eq(item_id)).first::<Tournament>(db)
  }
  
  pub fn read_all(db: &DB, pagination: &PaginationParams) -> QueryResult<Vec<Self>> {
      use crate::schema::tournaments::dsl::*;
  
      tournaments
          .order(created_at)
          .limit(pagination.page_size)
          .offset(pagination.page * std::cmp::max(pagination.page_size, PaginationParams::MAX_PAGE_SIZE as i64))
          .load::<Tournament>(db)
  }
  
  pub fn update(db: &DB, item_id: ID, item: &TournamentChangeset) -> QueryResult<Self> {
      use crate::schema::tournaments::dsl::*;
  
      diesel::update(tournaments.filter(id.eq(item_id)))
          .set(item)
          .get_result(db)
  }
  
  pub fn delete(db: &DB, item_id: ID) -> QueryResult<usize> {
      use crate::schema::tournaments::dsl::*;
  
      diesel::delete(tournaments.filter(id.eq(item_id))).execute(db)
  }
}
