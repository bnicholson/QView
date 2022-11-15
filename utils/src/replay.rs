extern crate diesel;
extern crate log;
extern crate log4rs;
extern crate log4rs_syslog;
extern crate url;

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
use rand::Rng;
use hyper::http::HeaderMap;
use hyper::client;
use hyper::body::HttpBody as _;
use tokio::io::{stdout, AsyncWriteExt as _};
use std::fs::File;
use std::io::{self, BufReader};
use std::path::Path;
use serde::Deserialize;
use csv::{ ReaderBuilder, Trim };
use std::env;
use url::form_urlencoded;
use base64;
use sha1::{Sha1, Digest};


// By default, struct field names are deserialized based on the position of
// a corresponding field in the CSV data's header record.
#[derive(Debug, Deserialize)]
struct CSVRecord {
    clientkey: String,
    tournament: String,
    division: String,
    room: String,
    round: String,
    question: String,
    eventnum: String,
    name: String,
    team: String,
    quizzer: String,
    event: String,
    parm1: String,
    parm2: String,
    clientts: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let args: Vec<String> = env::args().collect();

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


    let filename = "old/eventlog.big";
    // open the file in read-only mode (ignore errors)
    let file = File::open(filename).unwrap();
    let reader = BufReader::new(file);

    // construct/build a reader
    let mut rdr = ReaderBuilder::new()
        .delimiter(b',')
        .trim(Trim::All)
        .quote(b'\'')
        .from_reader(reader);


    // Build the CSV reader and iterate over each record.
//    let mut rdr = csv::Reader::from_reader(reader);         //io::stdin());
    for result in rdr.deserialize() {//records() {
        // The iterator yields Result<StringRecord, Error>, so we check the
        // error here.
        let record : CSVRecord = result?;
        println!("{:?}", record);

        let encoded = form_urlencoded::Serializer::new(String::new())
        .append_pair("bldgroom", "Not there")
        .append_pair("key", &record.clientkey)
        .append_pair("tk", "nokey")
        .append_pair("org","Nazarene")
        .append_pair("tn", &record.tournament)
        .append_pair("dn", &record.division)
        .append_pair("rm", &record.room)
        .append_pair("rd", &record.round)
        .append_pair("qn", &record.question)
        .append_pair("e", &record.eventnum)
        .append_pair("n", &record.name)
        .append_pair("t", &record.team)
        .append_pair("q", &record.quizzer)
        .append_pair("ec", &record.event)
        .append_pair("p1", &record.parm1)
        .append_pair("p2", &record.parm2)
        .append_pair("ts", "1234")
        .append_pair("md5","not valid")
        .append_pair("nonce",&get_nonce())
        .append_pair("s1s", &get_s1s(record))
        .finish();

        println!("Encoding: {:?}", encoded);
        // now send the call to qview server
        let url = format!("http://localhost:3000/scoreevent?{}",encoded);
        println!("Url = {:?}",url);
        let mut uri = url.parse()?;
        let mut resp = client.get(uri).await?;
        // And now...
        while let Some(chunk) = resp.body_mut().data().await {
            stdout().write_all(&chunk?).await?;
        }       
        
        get_nonce(); 
    }

    Ok(())
}

// The output is wrapped in a Result to allow matching on errors
// Returns an Iterator to the Reader of the lines of the file.
//fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
//where P: AsRef<Path>, {
//    let file = File::open(filename)?;
//    Ok(io::BufReader::new(file).lines())
//}

fn get_nonce() -> String {
    let mut rslt = String::new();
    let mut rng = rand::thread_rng();
    for i in 0..15 {
        let x: u8 = rng.gen();
        rslt.push_str(&(format!("{:x}",x)));
    }
    println!("Nonce string = {}", rslt);
    rslt
}

fn get_s1s(record : CSVRecord) -> String {
    // create the sha1 object
    let mut sha1hasher = Sha1::new();

    // the following code calculates and checks the sha1sum of all the GET parameters.
    // we had issues with the network (firewalls, app firewalls, etc) corrupting or 
    // giving false 200s.  This avoids that.
    // Grab the HOST:PORT the web server should run on.
    let scoreevent_psk = match std::env::var("SCOREEVENT_PSK") {
        Ok(scoreevent_psk) => {
            scoreevent_psk
        },
        Err(e) => {
            log::error!("{:?} {:?} Invalid SCOREEVENT_PSK",module_path!(),line!());
            "this won't work but fail".to_string()
        }
    };

    sha1hasher.update(record.nonce);
    sha1hasher.update(scoreevent_psk);
    sha1hasher.update(&record.bldgroom);
	sha1hasher.update(&record.clientkey);
	sha1hasher.update(&"nokey");
	sha1hasher.update(&record.tournament);
	sha1hasher.update(&record.division);
    sha1hasher.update(&record.room);
    sha1hasher.update(&record.round);
	sha1hasher.update(&record.question);
    sha1hasher.update(&record.eventnum);
    sha1hasher.update(&record.name);
    sha1hasher.update(&record.team);
    sha1hasher.update(&record.quizzer);
    sha1hasher.update(&record.event);
    sha1hasher.update(&record.parm1);
    sha1hasher.update(&record.parm2);
    let rslt = sha1hasher.finalize();
    let rsltbase64 = base64::encode(rslt);

    rsltbase64
}