table! {
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

table! {
    attachments (id) {
        id -> Int4,
        name -> Text,
        record_type -> Text,
        record_id -> Int4,
        blob_id -> Int4,
        created_at -> Timestamptz,
    }
}

table! {
    role_permissions (role, permission) {
        role -> Text,
        permission -> Text,
        created_at -> Timestamptz,
    }
}

table! {
    todos (id) {
        id -> Int4,
        text -> Text,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

table! {
    user_permissions (user_id, permission) {
        user_id -> Int4,
        permission -> Text,
        created_at -> Timestamptz,
    }
}

table! {
    user_roles (user_id, role) {
        user_id -> Int4,
        role -> Text,
        created_at -> Timestamptz,
    }
}

table! {
    user_sessions (id) {
        id -> Int4,
        user_id -> Int4,
        refresh_token -> Text,
        device -> Nullable<Text>,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

table! {
    users (id) {
        id -> Int4,
        email -> Text,
        hash_password -> Text,
        activated -> Bool,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

joinable!(attachments -> attachment_blobs (blob_id));
joinable!(user_permissions -> users (user_id));
joinable!(user_roles -> users (user_id));
joinable!(user_sessions -> users (user_id));

allow_tables_to_appear_in_same_query!(
    attachment_blobs,
    attachments,
    role_permissions,
    todos,
    user_permissions,
    user_roles,
    user_sessions,
    users,
);
