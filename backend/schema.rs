// @generated automatically by Diesel CLI.

diesel::table! {
    apicalllog (apicallid) {
        created_at -> Timestamptz,
        apicallid -> Int8,
        #[max_length = 8]
        method -> Varchar,
        uri -> Text,
        #[max_length = 32]
        version -> Varchar,
        headers -> Text,
    }
}

diesel::table! {
    attachment_blobs (id) {
        id -> Int4,
        key -> Text,
        file_name -> Text,
        content_type -> Nullable<Text>,
        byte_size -> Int8,
        checksum -> Text,
        service_name -> Text,
        created_at -> Timestamptz,
    }
}

diesel::table! {
    attachments (id) {
        id -> Int4,
        name -> Text,
        record_type -> Text,
        record_id -> Int4,
        blob_id -> Int4,
        created_at -> Timestamptz,
    }
}

diesel::table! {
    division_games (did, tdrri) {
        did -> Int8,
        tdrri -> Int8,
    }
}

diesel::table! {
    divisions (did) {
        did -> Int8,
        tid -> Int8,
        #[max_length = 32]
        dname -> Varchar,
        #[max_length = 32]
        breadcrumb -> Varchar,
        hide -> Bool,
        #[max_length = 1024]
        shortinfo -> Varchar,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

diesel::table! {
    eventlogs (evid) {
        evid -> Int8,
        created_at -> Timestamptz,
        #[max_length = 64]
        clientkey -> Varchar,
        #[max_length = 48]
        organization -> Varchar,
        #[max_length = 32]
        bldgroom -> Varchar,
        #[max_length = 48]
        tournament -> Varchar,
        #[max_length = 48]
        division -> Varchar,
        #[max_length = 48]
        room -> Varchar,
        #[max_length = 48]
        round -> Varchar,
        question -> Int4,
        eventnum -> Int4,
        #[max_length = 64]
        name -> Varchar,
        team -> Int4,
        quizzer -> Int4,
        #[max_length = 2]
        event -> Varchar,
        #[max_length = 64]
        parm1 -> Varchar,
        #[max_length = 64]
        parm2 -> Varchar,
        #[max_length = 32]
        ts -> Varchar,
        #[max_length = 32]
        clientip -> Varchar,
        #[max_length = 32]
        md5digest -> Varchar,
        #[max_length = 80]
        nonce -> Varchar,
        #[max_length = 32]
        s1s -> Varchar,
    }
}

diesel::table! {
    games (gid) {
        gid -> Int8,
        #[max_length = 48]
        org -> Varchar,
        #[max_length = 48]
        tournament -> Varchar,
        #[max_length = 48]
        division -> Varchar,
        #[max_length = 48]
        room -> Varchar,
        #[max_length = 48]
        round -> Varchar,
        #[max_length = 64]
        clientkey -> Varchar,
        ignore -> Bool,
        #[max_length = 32]
        ruleset -> Varchar,
    }
}

diesel::table! {
    quizevents (gid, question, eventnum) {
        gid -> Int8,
        question -> Int4,
        eventnum -> Int4,
        #[max_length = 64]
        name -> Varchar,
        team -> Int4,
        quizzer -> Int4,
        #[max_length = 2]
        event -> Varchar,
        #[max_length = 8]
        parm1 -> Varchar,
        #[max_length = 8]
        parm2 -> Varchar,
        clientts -> Timestamptz,
        serverts -> Timestamptz,
        #[max_length = 32]
        md5digest -> Varchar,
    }
}

diesel::table! {
    role_permissions (role, permission) {
        role -> Text,
        permission -> Text,
        created_at -> Timestamptz,
    }
}

diesel::table! {
    rooms (roomid) {
        roomid -> Int8,
        tid -> Int8,
        #[max_length = 32]
        name -> Varchar,
        #[max_length = 32]
        building -> Varchar,
        #[max_length = 64]
        quizmaster -> Varchar,
        #[max_length = 64]
        contentjudge -> Varchar,
        comments -> Text,
    }
}

diesel::table! {
    schedules (sid) {
        sid -> Int8,
        tid -> Int8,
        roundtime -> Timestamptz,
        #[max_length = 32]
        tournament -> Varchar,
        #[max_length = 32]
        division -> Varchar,
        #[max_length = 32]
        room -> Varchar,
        #[max_length = 32]
        round -> Varchar,
        #[max_length = 32]
        team1 -> Nullable<Varchar>,
        #[max_length = 32]
        team2 -> Nullable<Varchar>,
        #[max_length = 32]
        team3 -> Nullable<Varchar>,
        #[max_length = 32]
        quizmaster -> Nullable<Varchar>,
        #[max_length = 32]
        contentjudge -> Nullable<Varchar>,
        #[max_length = 32]
        scorekeeper -> Nullable<Varchar>,
        #[max_length = 1024]
        stats -> Nullable<Varchar>,
    }
}

diesel::table! {
    todos (id) {
        id -> Int4,
        text -> Text,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

diesel::table! {
    tournaments (tid) {
        tid -> Int8,
        #[max_length = 32]
        organization -> Varchar,
        #[max_length = 32]
        tname -> Varchar,
        #[max_length = 32]
        breadcrumb -> Varchar,
        fromdate -> Date,
        todate -> Date,
        #[max_length = 64]
        venue -> Varchar,
        #[max_length = 64]
        city -> Varchar,
        #[max_length = 64]
        region -> Varchar,
        #[max_length = 32]
        country -> Varchar,
        #[max_length = 64]
        contact -> Varchar,
        #[max_length = 255]
        contactemail -> Varchar,
        hide -> Bool,
        #[max_length = 1024]
        shortinfo -> Varchar,
        info -> Text,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

diesel::table! {
    user_permissions (user_id, permission) {
        user_id -> Int4,
        permission -> Text,
        created_at -> Timestamptz,
    }
}

diesel::table! {
    user_roles (user_id, role) {
        user_id -> Int4,
        role -> Text,
        created_at -> Timestamptz,
    }
}

diesel::table! {
    user_sessions (id) {
        id -> Int4,
        user_id -> Int4,
        refresh_token -> Text,
        device -> Nullable<Text>,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

diesel::table! {
    users (id) {
        id -> Int4,
        email -> Text,
        hash_password -> Text,
        activated -> Bool,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

diesel::joinable!(attachments -> attachment_blobs (blob_id));
diesel::joinable!(user_permissions -> users (user_id));
diesel::joinable!(user_roles -> users (user_id));
diesel::joinable!(user_sessions -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    apicalllog,
    attachment_blobs,
    attachments,
    division_games,
    divisions,
    eventlogs,
    games,
    quizevents,
    role_permissions,
    rooms,
    schedules,
    todos,
    tournaments,
    user_permissions,
    user_roles,
    user_sessions,
    users,
);
