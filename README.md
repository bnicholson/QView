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

 4 - now create a development database.

 5 - now you are ready to build the executables and the frontend code
cargo build

 5 - now run 
cargo fullstack

 6 - It's time to use the application
 Start your favorite browser
firefox

 7 - go to localhost 
http://localhost:3000


 8 - For more information
Read README.md.create-rust-app for more information on how to use.


# Development Environment Setup

Two scripts are used to set up the development environment for developing
QView:  1) getrustdev and 2) getdependencies



