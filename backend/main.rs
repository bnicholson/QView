#[macro_use]
extern crate diesel;

use actix_web::guard;

use actix_files::{Files};
use actix_web::{App, HttpServer, web};
use actix_web::middleware::{Compress, Logger, NormalizePath};
use actix_web::web::Data;

mod schema;
mod services;
mod models;
mod mail;
mod graphql;

//type DbPool = r2d2::Pool<ConnectionManager<SqliteConnection>>;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Now setup some of the crates that we'll use later
    let app_data = create_rust_app::setup();

    // Get the logging middleware up
//    dotenv::dotenv().ok();
//    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // set up database connection pool
//    let conn_spec = std::env::var("DATABASE_URL").expect("DATABASE_URL");
//    let manager = ConnectionManager::<PgConnection>::new(conn_spec);
//    let pool = r2d2::Pool::builder()
//        .build(manager)
//        .expect("Failed to create pool.");

    log::info!("starting HTTP server at http://localhost:8080");

    // Start HTTP server
    //HttpServer::new(move || {
    //    App::new()
    //        // set up DB pool to be used with web::Data<Pool> extractor
    //       .app_data(web::Data::new(pool.clone()))
    //        .wrap(middleware::Logger::default())
    //        .service(get_user)
    //        .service(add_user)
    //})
    //.bind(("127.0.0.1", 8080))?
    //.run()
    //.await

    // Create connection pool
//    let pool = r2d2::Pool::builder()
//        .build(manager)
//        .expect("Failed to create pool.");

   // Start HTTP server
   //HttpServer::new(move || {
   //     App::new().app_data(web::Data::new(pool.clone()))
   //     .resource("/{name}", web::get().to(index))
   // })
   // .bind(("127.0.0.1", 8080))?
   // .run()
   // .await

    // GraphQL Stuff
    let schema = async_graphql::Schema::build(graphql::QueryRoot, graphql::MutationRoot, graphql::SubscriptionRoot)
        .data(app_data.database.clone())
        .data(app_data.mailer.clone())
        .data(app_data.storage.clone())
        .finish();

    // Start the actix-web server
    HttpServer::new(move || {
        let mut app = App::new()
            .wrap(Compress::default())
            .wrap(NormalizePath::trim())
            .wrap(Logger::default());

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
        app = app.route("/scoreevent",web::get().to(services::scoreevent::index_playground));

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
    }).bind("0.0.0.0:3000")?.run().await
}
