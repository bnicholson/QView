extern crate diesel;
extern crate log;
extern crate log4rs;
extern crate log4rs_syslog;

use actix_web::guard;
use actix_files::{Files};
use actix_web::{App, HttpServer, web};
use actix_web::middleware::{Compress, Logger, NormalizePath};
use actix_web::web::Data;
//use syslog::{Facility, Formatter3164, Formatter5424, BasicLogger, LogFormat};
//use log::{error, info, warn, Record, Level, Metadata, LevelFilter, SetLoggerError };
//use log4rs::file::{ Deserializers };
//use log4rs::file::Deserializers;
use log4rs::file::Deserializers;

use hyper::http::HeaderMap;
use hyper::client;
use hyper::body::HttpBody as _;
use tokio::io::{stdout, AsyncWriteExt as _};
use std::fs::File;
use std::io::{self, BufRead};
use std::path::Path;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    // This is where we will setup our HTTP client requests.
    let client = hyper::client::Client::new();

    // Parse an `http::Uri`...
    let uri = "http://httpbin.org/ip".parse()?;
//    let uri = "http://www.amazon.com".parse()?;

    // Await the response...
    let mut resp = client.get(uri).await?;

    // And now...
    while let Some(chunk) = resp.body_mut().data().await {
        stdout().write_all(&chunk?).await?;
    }

    println!("Response: {}", resp.status());

    // File hosts must exist in current path before this produces output
    if let Ok(lines) = read_lines("./old/eventlog") {
        // Consumes the iterator, returns an (Optional) String
        for line in lines {
            if let Ok(ip) = line {
                println!("{}", ip);

                // now send the call to qview server
                let mut uri = "http://localhost:3000/scoreevent".parse()?;
                let mut resp = client.get(uri).await?;
                // And now...
                while let Some(chunk) = resp.body_mut().data().await {
                    stdout().write_all(&chunk?).await?;
                }
            }
        }
    }

    Ok(())
}

// The output is wrapped in a Result to allow matching on errors
// Returns an Iterator to the Reader of the lines of the file.
fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
where P: AsRef<Path>, {
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}