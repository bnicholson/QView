// Do various things with the RoomInfo [Room Information]
extern crate redis;
use chrono::Utc;
use crate::models::common::*;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct RoomInfoData {
    pub clientkey: String,
    pub bldgroom: String,
    pub chkd_in: UTC,
    pub client_time: UTC,
    pub tournament: String,
    pub division: String,
    pub room: String,
    pub round: String,
    pub question: i32,                                
    pub error_msgs: Vec<String>,
    pub clientip: String,
    pub jobs_pending: i32,
    pub qm_version: String,
    pub resend_list: Vec<i32>,
    pub cmd_list: Vec<String>,
}

impl RoomInfoData {
    pub fn to_RoomInfoData(&mut self) -> RoomInfoData<> {
        RoomInfoData {
           clientkey: self.clientkey.to_string(),
            bldgroom: self.bldgroom.to_string(),
            chkd_in: self.chkd_in,
            client_time: self.client_time,
            tournament: self.tournament.to_string(),
            division: self.division.to_string(),
            room: self.room.to_string(),
            round: self.round.to_string(),
            question:  self.question,
            error_msgs: self.error_msgs.to_vec(),
            clientip: self.clientip.to_string(),
            jobs_pending: self.jobs_pending,
            qm_version: self.qm_version.to_string(),
            resend_list: self.resend_list.to_vec(),
            cmd_list: self.cmd_list.to_vec()
        }
    }
}

pub fn empty() -> RoomInfoData<> {
    RoomInfoData {
        clientkey: "".to_string(),
        bldgroom: "".to_string(),
        chkd_in: Utc::now(),
        client_time: Utc::now(),
        tournament: "".to_string(),
        division: "".to_string(),
        room: "".to_string(),
        round: "".to_string(),
        question: -1,
        error_msgs: [ ].to_vec(),
        clientip: "".to_string(),
        jobs_pending: 0,
        qm_version: "".to_string(),
        resend_list: [].to_vec(),
        cmd_list: [].to_vec(),
    }
}

pub fn do_something(print: bool, only_one: bool) {               //-> redis::RedisResult<()> {
    let mut ri = empty();//find_roominfo("a".to_string(),"b".to_string(),"c".to_string(),"d".to_string(),"e".to_string());
    let json = serde_json::to_string(&ri).unwrap();

    let client = redis::Client::open("redis://127.0.0.1/").unwrap();
    let mut con = client.get_connection().unwrap();

    let _ : () = redis::cmd("set").arg("my_key").arg(json).query(&mut con).unwrap();    //Result<T, RedisError>
    if print {
        println!("set a key in redis something ");
    }
    if only_one {
        return;
    }
    
    let rslt : String = redis::cmd("get").arg("my_key").query(&mut con).unwrap();
    if print {
        println!("Got something from the read {:?} ", rslt);
    }

    // now set something in ri
    ri.clientip = "127.0.0.33".to_string();
    if print {
        println!("RI is now set to {:?}", ri);
    }
    let rslt : String = redis::cmd("get").arg("my_key").query(&mut con).unwrap();
    if print {
        println!("Got something from the read {:?} ", rslt);
    }
    let ri : RoomInfoData = serde_json::from_str(&rslt).unwrap();  
    if print {
        println!("RI is now set to {:?}", ri);
    }
}

// Construct a key for the roominfo information.
// we will use this to update the roominfo in the cache.
pub fn update_roominfo( ri: &mut RoomInfoData,tid: i64 ) -> RoomInfoData {
    let roomkey = format!("QV:RI:{}:{}",tid,ri.clientkey);
    println!("Roomkey = {:?}",roomkey);

    let client = redis::Client::open("redis://127.0.0.1/").unwrap();
    let mut con = client.get_connection().unwrap();
//    let json : String = redis::cmd("get").arg(roomkey).query(&mut con).unwrap();   
    let mut json = "".to_string();

    // rri will contain anything we retrieved from the cache or nothing
    // when the following match is done
    let mut rri = empty();       
    match redis::cmd("get").arg(&roomkey).query::<Option<String>>(&mut con) {
        Ok(nil) => {
            println!("Got a nil from a get command to redis {:?}",line!());
            rri = ri.to_RoomInfoData();
        },
        Ok(rjson) => {
            println!("what is the result of the get {:?} {:?}",rjson,line!());
            let json_str : String = rjson.unwrap();
            rri = serde_json::from_str(&json_str).unwrap(); 
        },
        Err(e) => {
            log::error!("{} {} Fault retrieving redis cache for roominfo {:?} {:?} {:?}",module_path!(),line!(),
                e, tid, ri);
            rri = ri.to_RoomInfoData();
        },
    }

    let json = serde_json::to_string(&ri).unwrap();     //Result<T, RedisError>
    //let rslt : Result<e, RedisError> =  
    // this also sets the ttl of this key 30 minutes in the future
    match redis::Cmd::set_ex(roomkey, json, 1800).query::<Option<String>>(&mut con) {
        Ok(nil) => {
            println!("Got a nil");
        },
        Ok(rslt) => {
            println!("redis set result {:?} {:?} ", rslt,line!());
        },
        Err(e) => {
            println!("redis error {:?} {:?}", e,line!());
        },
    }

    let newri = empty();
    // return the updated roominfo that was set
    newri
}

