use chrono::DateTime;
use chrono::Utc;

#[tsync::tsync]
pub type ID = i64;

#[tsync::tsync]
pub type UTC = DateTime<Utc>;

#[tsync::tsync]
#[derive(serde::Deserialize)]
pub struct PaginationParams {
    pub page: i64,
    pub page_size: i64,
}

impl PaginationParams {
    pub const MAX_PAGE_SIZE: u16 = 100;
}
