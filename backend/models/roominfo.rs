// Do various things with the RoomInfo [Room Information]
extern crate redis;
use chrono::Utc;
use crate::models::common::*;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct RoomInfoData {
    clientkey: String,
    bldgroom: String,
    chkd_in: UTC,
    client_time: UTC,
    tournament: String,
    division: String,
    room: String,
    round: String,
    question: i32,                                
    error_msgs: Vec<String>,
    host: String,
    jobs_pending: i32,
    qm_version: String,
    resend_list: Vec<i32>,
    cmd_list: Vec<String>,
}

fn empty() -> RoomInfoData<> {
    RoomInfoData {
        clientkey: ";alskjdf".to_string(),
        bldgroom: "bens-room".to_string(),
        chkd_in: Utc::now(),
        client_time: Utc::now(),
        tournament: "q2023".to_string(),
        division: "District-Novice".to_string(),
        room: "Jester 102".to_string(),
        round: "Tue-07d".to_string(),
        question: 3,
        error_msgs: [ "not sure".to_string(), "none".to_string()].to_vec(),
        host: "nicengl91".to_string(),
        jobs_pending: 34,
        qm_version: "5.4J30".to_string(),
        resend_list: [1,2,3,67].to_vec(),
        cmd_list: ["".to_string()].to_vec(),
    }
}

pub fn do_something(print: bool, only_one: bool) {               //-> redis::RedisResult<()> {
    let mut ri = find_roominfo("a".to_string(),"b".to_string(),"c".to_string(),"d".to_string(),"e".to_string());
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
    ri.host = "Jackson".to_string();
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

fn find_roominfo(org: String, tournament: String, division: String, room: String, round: String) -> RoomInfoData<> {
    let ri = RoomInfoData {
        clientkey: ";alskjdf".to_string(),
        bldgroom: "bens-room".to_string(),
        chkd_in: Utc::now(),
        client_time: Utc::now(),
        tournament: "q2023".to_string(),
        division: "District-Novice".to_string(),
        room: "Jester 102".to_string(),
        round: "Tue-07d".to_string(),
        question: 3,
        error_msgs: [ "not sure".to_string(), "none".to_string()].to_vec(),
        host: "nicengl91".to_string(),
        jobs_pending: 34,
        qm_version: "5.4J30".to_string(),
        resend_list: [1,2,3,67].to_vec(),
        cmd_list: [].to_vec(),
    };
    ri
}

