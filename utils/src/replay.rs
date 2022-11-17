extern crate diesel;
extern crate log;
extern crate log4rs;
extern crate log4rs_syslog;
extern crate url;

use rand::Rng;
use hyper::body::HttpBody as _;
use tokio::io::{stdout, AsyncWriteExt as _};
use std::fs::File;
use std::io::{ BufReader };
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

    let limit : i32 = args[1].parse().unwrap();

    // load the environment
    if dotenv::dotenv().is_err() {
        panic!("ERROR: Could not load environment variables from dotenv file");
    }

            
    // This is where we will setup our HTTP client requests.
    let client = hyper::client::Client::new();

    // Parse an `http::Uri`...
    let uri = "http://httpbin.org/ip".parse()?;

    // Await the response...
    let mut resp = client.get(uri).await?;

    // And now...
    while let Some(chunk) = resp.body_mut().data().await {
        stdout().write_all(&chunk?).await?;
    }

    println!("Response: {}", resp.status());

    // now let's open the eventlog and start reading it
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

    let mut count = 0;

    // Build the CSV reader and iterate over each record.
    for result in rdr.deserialize() {
        count = count + 1;
        if count > limit {
            break;
        }
        
        // The iterator yields Result<StringRecord, Error>, so we check the
        // error here.
        let record : CSVRecord = result?;
//        println!("{:?}", record);

        // set up the remaining info
        let bldgroom = "Ben".to_string();
        let nonce = get_nonce();
        let tk = "nokey".to_string();
        let org = "Nazarene".to_string();
        let md5 = "not valid".to_string();
        let clientts = "1234".to_string();
        let s1s = get_s1s(&record, &bldgroom, &nonce, &tk, &org);

        let encoded = form_urlencoded::Serializer::new(String::new())
        .append_pair("bldgroom", &bldgroom)
        .append_pair("key", &record.clientkey)
        .append_pair("tk", &tk)
        .append_pair("org",&org)
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
        .append_pair("ts", &clientts)
        .append_pair("md5",&md5)
        .append_pair("nonce",&nonce)
        .append_pair("s1s", &s1s)
        .finish();

        println!("\nMD5 is now this {} Line: {}\n",md5,count);
        println!("Encoded = {}\n",encoded);

//        println!("Encoding: {:?}", encoded);
        // now send the call to qview server
        let url = format!("http://localhost:3000/scoreevent?{}",encoded);
        println!("\nUrl = {:?}\n",url);
        let uri = url.parse()?;
        let mut resp = client.get(uri).await?;
        // And now...
        while let Some(chunk) = resp.body_mut().data().await {
            stdout().write_all(&chunk?).await?;
        }       
        println!("Resp = {:?}\n",resp);

        // now if it's not a 200 then we need to stop
        if resp.status() != 200 {
            panic!("Blew up on eventlog line {}",count);
        }
    }

    // Okay print how many we did.
    println!("Sent {} eventlogs to the server.",count-1);

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
    for _i in 0..15 {
        let x: u8 = rng.gen();
        rslt.push_str(&(format!("{:x}",x)));
    }
    //    println!("Nonce string = {}", rslt);
    rslt
}

fn get_s1s(record : &CSVRecord, bldgroom: &String, nonce: &String, tk: &String, org: &String) -> String {
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
            log::error!("{:?} {:?} Invalid SCOREEVENT_PSK {:?}",module_path!(),line!(), e);
            "this won't work but fail".to_string()
        }
    };

    sha1hasher.update(nonce);
    sha1hasher.update(scoreevent_psk);
    sha1hasher.update(&bldgroom);
	sha1hasher.update(&record.clientkey);
	sha1hasher.update(&tk);
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