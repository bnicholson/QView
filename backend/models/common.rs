use chrono::DateTime;
use chrono::Utc;

#[tsync::tsync]
pub type ID = i32;

#[tsync::tsync]
pub type BigId = i64;

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

#[tsync::tsync]
#[derive(serde::Deserialize)]
pub struct SearchDateParams {
    pub from_date: i64,
    pub to_date: i64,
}

impl SearchDateParams {
    pub const MAX_PAGE_SIZE: u16 = 100;
}

