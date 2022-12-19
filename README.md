# QView

QView is a React RUST web application designed to manage tournaments for
Quizzing events such as Bible Quizzing, Physics Quizzes, etc.

Rust provides the backend APIs and microservices.
The frontend is designed using the React Javascript framework.
The UI is designed using the Material UI framework and components.

The backend database is Postgresql.
Redis is used as a cache and as a inter Qview server store.  

Note:  A development environment is up at http://qview.quizstuff.com:3000

# Requirements & How to set up the Development Environment

1) - Install Ubuntu desktop on a machine or on a VM/Hypervisor/Virtualbox.

2) - Install git.
      
	sudo apt install git

3) - Set up the development environment.
Clone the project in the working direction you desire.

      git clone https://github.com/bnicholson/qview.git
      cd qview

4) getrustdev: this script loads all the required linux (debian) programs needed to develop such as Rust, git, etc.
	
	./getrustdev

5) At the same directory level as the main Qview clone the create-rust-app project. 

      cd ..
      git clone http://github.com/bnicholson/create-rust-app
      cd create-rust-app
      cargo build
      cd ..
      cd qview

6) - now install the javascript libraries needed by the UI frontend
	cd frontend
	yarn install

7) - now create a development database.   Qview uses Postgresql as the database.   Install postgresql using standard Ubuntu tooling.

8) Create a standard postgreSQL database using the following commands as the postgres user

      sudo bash
      su - postgres
      psql
      CREATE DATABASE qviewdev;
      CREATE USER qview;
      ALTER USER qview PASSWORD 'somepassword';
      ALTER USER qview WITH SUPERUSER;
      \q
      exit
      exit
      
8) Now populate the database with the tables needed for qview
      diesel migration run

9) Remove the superuser permissions from qview

      sudo bash
      su - postgres
      psql
      ALTER USER qview with NOSUPERUSER;
      \q
      exit
      exit

10) - now you are ready to build the executables and the frontend code

	cargo build

11) - Create and populate all the appropriate environment variables in the .env file.
    
    SECRET_KEY=some_secret
    DATABASE_URL=postgres://qview:somepassword@localhost/qviewdev
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

12) - Restart the terminal to refresh the environment variables.

13) - now run 
      
	cargo fullstack

14) - It's time to use the application.   Start your favorite browser
      
	firefox

15) - Go to localhost 

      http://localhost:3000


16) - For more information
Read README.md.create-rust-app for more information on how to use create-rust-app.   This project was originally started using the create-rust-app tool.

