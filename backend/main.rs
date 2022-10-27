extern crate diesel;
use std::collections::HashMap;
use actix_web::guard;
use std::process;
use actix_files::{Files};
use actix_web::{App, HttpServer, web};
use actix_web::middleware::{Compress, Logger, NormalizePath};
use actix_web::web::Data;
use syslog::{Facility, Formatter3164, Formatter5424, BasicLogger, LogFormat};
use crate::utils::FormatterLog::{FormatterNiceng};
use log::{error, info, warn, Record, Level, Metadata, LevelFilter, SetLoggerError };

mod schema;
mod services;
mod models;
mod utils;
mod mail;
mod graphql;


#[actix_web::main]
async fn main() -> std::io::Result<()> {

    // this should setup logging if we are not in debug mode
    #[cfg(not(debug_assertions))] {
        let formatter = FormatterNiceng {
            facility: Facility::LOG_LOCAL4,
            hostname: None,
            process: "qview".into(),
            pid: process::id(),
        };

        let logger = syslog::unix(formatter).expect("could not connect to syslog");
        match log::set_boxed_logger(Box::new(BasicLogger::new(logger)))
                .map(|()| log::set_max_level(LevelFilter::Info)) {
            Err(e) => println!("Error connecting to syslog via unix {:?}",e),
            Ok(j) => println!("Connected to syslog via unix {:?}",j),
        }
    }

    // Now setup some of the crates that we'll use later
    let app_data = create_rust_app::setup();

    // GraphQL Stuff
    let schema = async_graphql::Schema::build(graphql::QueryRoot, graphql::MutationRoot, graphql::SubscriptionRoot)
        .data(app_data.database.clone())
        .data(app_data.mailer.clone())
        .data(app_data.storage.clone())
        .finish();

    // Grab the HOST:PORT the web server should run on.
    let host_port = match std::env::var("HOST_PORT") {
        Ok(host_and_port) => {
            host_and_port
        },
        Err(e) => {
            "0.0.0.0:3000".to_string()
        }
    };

    // Start the actix-web server
    HttpServer::new(move || {
        let mut app = App::new()
            .wrap(Compress::default())
            .wrap(NormalizePath::trim())
            .wrap(Logger::default());


        log::info!("starting HTTP server at http://localhost:3000");

        app = app.app_data(Data::new(app_data.database.clone()));
        app = app.app_data(Data::new(app_data.mailer.clone()));
        app = app.app_data(Data::new(schema.clone()));
        app = app.app_data(Data::new(app_data.storage.clone()));

        let mut api_scope = web::scope("/api");
        api_scope = api_scope.service(web::resource("/graphql").guard(guard::Post()).to(graphql::index));
        api_scope = api_scope.service(web::resource("/graphql/ws")
                .guard(guard::Get())
                .guard(guard::Header("upgrade", "websocket"))
                .to(graphql::index_ws));
        api_scope = api_scope.service(services::file::endpoints(web::scope("/files")));
        api_scope = api_scope.service(create_rust_app::auth::endpoints(web::scope("/auth")));
        api_scope = api_scope.service(services::todo::endpoints(web::scope("/todos")));
        api_scope = api_scope.service(services::tournament::endpoints(web::scope("/tournaments")));
        api_scope = api_scope.service(services::scoreevent::endpoints(web::scope("/scoreevents")));
        api_scope = api_scope.service(services::division::endpoints(web::scope("/divisions")));

        // now route the "/scoreevents" logic to the same place as /api/scoreevents
        // this is needed for backwards compatibility with the old quizmachines (pre < 6.0)
        app = app.route("/scoreevent",web::get().to(services::scoreevent::write));

        #[cfg(debug_assertions)]
        {
            /* Development-only routes */
            // Mount the GraphQL playground on /graphql
            app = app.route("/graphql", web::get().to(graphql::index_playground));
            // Mount development-only API routes
            api_scope = api_scope.service(create_rust_app::dev::endpoints(web::scope("/development")));
            // Mount the admin dashboard on /admin
            app = app.service(web::scope("/admin").service(Files::new("/", ".cargo/admin/dist/").index_file("admin.html")));
        }

        app = app.service(api_scope);
        app = app.default_service(web::get().to(create_rust_app::render_views));
        app
    }).bind(host_port)?.run().await
}
