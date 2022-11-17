extern crate diesel;
extern crate log;
extern crate log4rs;
extern crate log4rs_syslog;

use actix_web::guard;
use actix_files::{Files};
use actix_web::{App, HttpServer, web};
use actix_web::middleware::{Compress, Logger, NormalizePath};
use actix_web::web::Data;
//use syslog::{Facility, Formatter3164, Formatter5424, BasicLogger, LogFormat};
//use log::{error, info, warn, Record, Level, Metadata, LevelFilter, SetLoggerError };
//use log4rs::file::{ Deserializers };
//use log4rs::file::Deserializers;
use log4rs::file::Deserializers;

mod schema;
mod services;
mod models;
mod mail;
mod graphql;


#[actix_web::main]
async fn main() -> std::io::Result<()> {

    #[cfg(not(debug_assertions))] {
         // Handle setting up log4rs (logging)
        // add syslog support
        let mut deserializers = log4rs::file::Deserializers::new();
        log4rs_syslog::register(&mut deserializers);
        // 
        log4rs::init_file("config/logging_prod.yaml",deserializers).unwrap();  
    }

    #[cfg(debug_assertions)]
    log4rs::init_file("config/logging_debug.yaml",Default::default()).unwrap();

    // tell everyone we have logging running
    log::info!("Initialized log4rs");

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
        api_scope = api_scope.service(services::pingmsg::endpoints(web::scope("/pingmsg")));    
        api_scope = api_scope.service(services::namelist::endpoints(web::scope("/namelist")));        
        api_scope = api_scope.service(services::division::endpoints(web::scope("/divisions")));

        // now route the "/scoreevents" logic to the same place as /api/scoreevents
        // this is needed for backwards compatibility with the old quizmachines (pre < 6.0)
        app = app.route("/scoreevent",web::get().to(services::scoreevent::write));
        // now do the same for the /pingmsg old style api call
        app = app.route("/pingmsg",web::get().to(services::pingmsg::write));
        // and time to do the /namelist
        app = app.route("/namelist",web::get().to(services::namelist::write));

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
