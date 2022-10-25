// @generated automatically by Diesel CLI.

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
        dname -> Varchar,
        breadcrumb -> Varchar,
        hide -> Bool,
        shortinfo -> Varchar,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

diesel::table! {
    eventlog (eid) {
        created_at -> Timestamptz,
        eid -> Int8,
        key4server -> Varchar,
        tournament -> Varchar,
        division -> Varchar,
        room -> Varchar,
        round -> Varchar,
        question -> Int4,
        eventnum -> Int4,
        name -> Varchar,
        team -> Int4,
        quizzer -> Int4,
        event -> Varchar,
        parm1 -> Varchar,
        parm2 -> Varchar,
        ts -> Varchar,
        host -> Varchar,
        md5digest -> Varchar,
        nonce -> Varchar,
        s1s -> Varchar,
    }
}

diesel::table! {
    games (tdrri) {
        tdrri -> Int8,
        org -> Varchar,
        tournament -> Varchar,
        division -> Varchar,
        room -> Varchar,
        round -> Varchar,
        key4server -> Nullable<Varchar>,
        ignore -> Nullable<Bool>,
        ruleset -> Varchar,
    }
}

diesel::table! {
    quizzes (tdrri, question, eventnum) {
        tdrri -> Int8,
        question -> Int4,
        eventnum -> Int4,
        name -> Varchar,
        team -> Int4,
        quizzer -> Int4,
        event -> Varchar,
        parm1 -> Nullable<Varchar>,
        parm2 -> Nullable<Varchar>,
        clientts -> Nullable<Timestamptz>,
        serverts -> Nullable<Timestamptz>,
        md5digest -> Nullable<Varchar>,
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
        name -> Varchar,
        building -> Nullable<Varchar>,
    }
}

diesel::table! {
    schedules (sid) {
        sid -> Int8,
        tid -> Int8,
        roundtime -> Timestamptz,
        tournament -> Varchar,
        division -> Varchar,
        room -> Varchar,
        round -> Varchar,
        team1 -> Nullable<Varchar>,
        team2 -> Nullable<Varchar>,
        team3 -> Nullable<Varchar>,
        quizmaster -> Nullable<Varchar>,
        contentjudge -> Nullable<Varchar>,
        scorekeeper -> Nullable<Varchar>,
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
        organization -> Varchar,
        tname -> Varchar,
        breadcrumb -> Varchar,
        fromdate -> Date,
        todate -> Date,
        venue -> Varchar,
        city -> Varchar,
        region -> Varchar,
        country -> Varchar,
        contact -> Varchar,
        contactemail -> Varchar,
        hide -> Bool,
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
    attachment_blobs,
    attachments,
    division_games,
    divisions,
    eventlog,
    games,
    quizzes,
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
