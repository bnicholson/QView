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
    games (tdrri) {
        tdrri -> Uuid,
        org -> Varchar,
        tournament -> Varchar,
        division -> Varchar,
        room -> Varchar,
        round -> Varchar,
        key4server -> Nullable<Varchar>,
        ignore -> Nullable<Bpchar>,
        ruleset -> Varchar,
    }
}

diesel::table! {
    quizzes (tdrri, question, eventnum) {
        tdrri -> Uuid,
        question -> Int4,
        eventnum -> Int4,
        name -> Nullable<Varchar>,
        team -> Nullable<Int4>,
        quizzer -> Nullable<Int4>,
        event -> Nullable<Varchar>,
        parm1 -> Nullable<Varchar>,
        parm2 -> Nullable<Varchar>,
        ts -> Nullable<Timestamptz>,
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
    todos (id) {
        id -> Int4,
        text -> Text,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

diesel::table! {
    tournaments (id) {
        id -> Int4,
        organization -> Varchar,
        tournament -> Varchar,
        fromdate -> Date,
        todate -> Date,
        venue -> Varchar,
        city -> Varchar,
        region -> Varchar,
        country -> Varchar,
        contact -> Varchar,
        contactemail -> Varchar,
        hide -> Bool,
        info -> Nullable<Text>,
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
    games,
    quizzes,
    role_permissions,
    todos,
    tournaments,
    user_permissions,
    user_roles,
    user_sessions,
    users,
);
