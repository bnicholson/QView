# QView

QView is a React RUST web application designed to manage tournaments for
Quizzing events such as Bible Quizzing, Physics Quizzes, etc.

Rust provides the backend APIs and microservices.
The frontend is designed using the React JavaScript framework.
The UI is designed using the Material UI framework and components.

The backend database is Postgresql.
Redis/Valkey is used as a cache and as a inter Qview server store if we 
end up having two application servers.  

Note:  A beta/UAT development environment is up at http://qview.quizstuff.com:3000

# Requirements & How to set up the Development Environment

1) Install Ubuntu desktop on a machine or on a VM/Hypervisor/Virtualbox.

2) Install git in Ubuntu.
   ```
   sudo apt install git
   ```

3) Clone the project in the working directory you desire.
   ```
   git clone https://github.com/bnicholson/qview.git
   cd qview
   ```

4) `getrustdev`: this script loads all the required linux (debian) programs needed to develop such as Rust, PostgreSQL, etc.
	```
   ./getrustdev
   ```

5) At the same directory level as the main QView, clone the _create-rust-app_ project. 
   ```
   cd ..
   git clone http://github.com/bnicholson/create-rust-app
   cd create-rust-app
   cargo build
   cd ..
   cd qview
   ```

6) Now install the JavaScript libraries needed by the UI frontend.
   ```
   cd frontend
   yarn install
   cd ..
   ```

7) Now create a development database. QView uses PostgreSQL as the database. Create a standard PostgreSQL database using the following commands as the PostgreSQL user.
   ```
   sudo bash
   su - postgres
   psql
   CREATE DATABASE qviewdev;
   CREATE USER sammy;
   ALTER USER sammy PASSWORD 'somepassword';
   ALTER USER sammy WITH SUPERUSER;
   \q
   exit
   exit
   ```

   Note:  There is an example script under setup-db-valkey.sh that does this and other work.
   This script replaces steps #8, #9, #10.   The script isn't perfect - it has flaws.

8) Create an .env file with the following data (update your user & password)
   ```
   DATABASE_URL=postgres://sammy:somepassword@localhost/qviewdev
   ```

9) Now populate the database with the tables needed for QView.
   ```
   diesel migration run
   ```

10) Remove the superuser permissions from QView.
   ```
   sudo bash
   su - postgres
   psql
   ALTER USER sammy with NOSUPERUSER;
   \q
   exit
   exit
   ```

11) Now you are ready to build the executables and the frontend code.
    ```
    cargo build
    ```

12) Create and populate all the appropriate environment variables in the `.env` file.
    ```
    SECRET_KEY=some_secret
    DATABASE_URL=postgres://sammy:somepassword@localhost/qviewdev
    RUST_BACKTRACE=1
    S3_HOST=http://localhost:9000
    S3_REGION=minio
    S3_BUCKET=bucket
    S3_ACCESS_KEY_ID=access_key
    S3_SECRET_ACCESS_KEY=secret_key
    SCOREEVENT_PSK=secret_quizmachine_client_key
    SMTP_FROM_ADDRESS=QView@somewhere.com 
    SMTP_SERVER=mailserver_from_somewhere.com
    SMTP_USERNAME=userid@somewhere.com
    SMTP_PASSWORD=secret_mailer_password
    SEND_MAIL=true
    ```

13) Restart the terminal to refresh the environment variables.

14) Now run the project using Cargo.
    ```  
    cargo fullstack
    ```

15) It's time to use the application. Start your favorite browser.
    ```
    firefox
    ```

16) Go to localhost 
    ```
    http://localhost:3000
    ```

17) For more information:
  - Read README.md.create-rust-app for more information on how to use create-rust-app. This project was originally started using the create-rust-app tool.

# How It Works
The backend is written in Rust and the frontend in TypeScript.
The frontend uses React, Redux, and Material UI.

Some API types are automatically generated by tsync.
https://github.com/Wulf/tsync
