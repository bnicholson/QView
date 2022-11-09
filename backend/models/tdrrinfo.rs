// Do various things with the RoomInfo [Room Information]
extern crate redis;
use chrono::Utc;
use crate::models::common::*;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct TDRRInfoData {
    organization: String,
    tournament: String,
    division: String,
    room: String,
    round: String,
    clientkey: String,    
    question: i32,                                
    quiz_done: bool,
    data_okay: bool,
    quiz_time: UTC,
    tdrri: BigId,
    num_teams: i32,
    team_names: Vec<Strings>,
    scores: Vec<i32>,
    selected: bool,
    quiz_info: String,
    audit_time: UTC,
}

fn new() -> TDRRInfoData<> {
    TDRRInfoData {
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
