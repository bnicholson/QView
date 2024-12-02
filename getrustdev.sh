# Rust and TypeScript Editor
sudo snap install code --classic

# Now more development tools
# sudo apt install git # If you followed the readme, you already installed git.
sudo apt install npm

# Install Rust
sudo apt install rustc
sudo apt install rust-src
sudo apt install cargo

# This is required before running `cargo build` on the create-rust-app project.
sudo apt install pkg-config

# Install the database library.
sudo apt install postgresql
sudo apt install postgresql-contrib

# Install the database driver for PostgreSQL.
sudo apt install libpq-dev

#
# Install a tool for helping manipulate Diesel (Rust CRUD ORM)
#
cargo install diesel_cli --no-default-features --features postgres
#
# actix-web (Rust Web Server) stuff (mostly creating react web apps)
#
cargo install tsync

# More generic cargo tools
cargo install cargo-edit
cargo install cargo-watch

# # Add one of them to the path TODO: You probably don't need this.
# echo 'export PATH="$PATH":~/.cargo/bin' >> ~/.bashrc

# Node add some node things we need
sudo npm install -g yarn

# Add all the docker tools
sudo apt install docker.io docker-compose
# 
# Make sure we have a recently updated nodejs
#
sudo npm install -g n
sudo n lts
n ls

# 
# Now install redis - later we'll move this to valkey (probably).
#
sudo apt install redis-server
sudo apt install redis-tools

#
# Add ~/.cargo/bin to the user's profile
#
PROFILE=$HOME/.profile
if ! grep 'cargo bin if' "$PROFILE"; then
   echo "Adding to the .profile the user's cargo bin"
   echo "# set PATH so it includes a users private cargo bin if it exists" >>~/.profile
   echo 'if [ -d "$HOME/.cargo/bin" ] ; then' >>~/.profile
   echo '    PATH="$HOME/.cargo/bin:$PATH"' >>~/.profile
   echo 'fi'  >>~/.profile
fi
