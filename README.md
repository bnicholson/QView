# QView

QView is a React RUST web application designed to manage tournaments for
Quizzing events such as Bible Quizzing, Physics Quizzes, etc.

Rust provides the backend APIs and microservices.
The frontend is designed using the React Javascript framework.
The UI is designed using the Material UI framework and components.

The backend database is Postgresql.


# Requirements & how to develop

1 - Install Ubuntu desktop on a machine or on a VM/Hypervisor/Virtualbox

 2 - Set up the development environment.
 getrustdev: this script loads all the required linux (debian) programs needed to develop such as Rust, git, etc.

./getrustdev

 3 - now install the javascript libraries needed by the UI frontend
 getdependencies:  This script loads all the javascript modules needed such as react and material-ui.
cd frontend;./getdependencies

 4 - now create a development database.   Qview uses Postgresql as the database.   

Create a standard postgres database using the following as the postgres user

sudo bash
su - postgres
psql
CREATE DATABASE qviewdev ;
CREATE USER qview;
// you may have to adjust the permissions since diesel migration is used to populate the database

 5 - now you are ready to build the executables and the frontend code
cargo build

 6 - Create and populate all the appropriate environment variables in the .env file.
    SECRET_KEY=some_secret
    DATABASE_URL=postgres://someuserid:somepasswd@localhost/qviewdev
    RUST_BACKTRACE=1

    // not currently used - future
    S3_HOST=http://localhost:9000
    S3_REGION=minio
    S3_BUCKET=bucket
    S3_ACCESS_KEY_ID=access_key
    S3_SECRET_ACCESS_KEY=secret_key

    SCOREEVENT_PSK=secret_quizmachine_client_key

    // currently not used - but should work
    SMTP_FROM_ADDRESS=QView@somewhere.com 
    SMTP_SERVER=mailserver_from_somewhere.com
    SMTP_USERNAME=userid@somewhere.com
    SMTP_PASSWORD=secret_mailer_password
    SEND_MAIL=true

 7 - now run 
cargo fullstack

 8 - It's time to use the application
 Start your favorite browser
firefox

 9 - go to localhost 
http://localhost:3000


 10 - For more information
Read README.md.create-rust-app for more information on how to use.


# Development Environment Setup

Two scripts are used to set up the development environment for developing
QView:  1) getrustdev and 2) getdependencies



