#!/bin/bash

# Function to detect the package manager
detect_package_manager() {
    if command -v apt &> /dev/null; then
        echo "apt"
    elif command -v pacman &> /dev/null; then
        echo "pacman"
    else
        echo "Unsupported package manager. Please install apt or pacman."
        exit 1
    fi
}

# Function to check if a package is installed
is_installed() {
    case $PACKAGE_MANAGER in
        apt)
            dpkg -l | grep -qw "$1"
            ;;
        pacman)
            pacman -Q "$1" &> /dev/null
            ;;
        *)
            echo "Unsupported package manager."
            exit 1
            ;;
    esac
}

# Function to install packages only if they are not already installed
install_package() {
    for package in "$@"; do
        if is_installed "$package"; then
            echo "$package is already installed. Skipping."
        else
            case $PACKAGE_MANAGER in
                apt)
                    sudo apt install -y "$package"
                    ;;
                pacman)
                    sudo pacman -Syu --noconfirm "$package"
                    ;;
            esac
        fi
    done
}

# Function to check for snap and install VS Code
install_code_editor() {
    if command -v code &> /dev/null; then
        echo "VS Code is already installed. Skipping."
    elif [ "$PACKAGE_MANAGER" = "apt" ]; then
        echo "Installing VS Code via apt..."
        # Add Microsoft repository and install VS Code via apt
        if ! is_installed code; then
            # Microsoft's instructions to install VS Code. Copied from
            # https://code.visualstudio.com/docs/setup/linux
            sudo apt-get install wget gpg
            wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
            sudo install -D -o root -g root -m 644 packages.microsoft.gpg /etc/apt/keyrings/packages.microsoft.gpg
            echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" |sudo tee /etc/apt/sources.list.d/vscode.list > /dev/null
            rm -f packages.microsoft.gpg
            sudo apt install apt-transport-https
            sudo apt update
            sudo apt install code # or code-insiders
        fi
    elif [ "$PACKAGE_MANAGER" = "pacman" ]; then
        echo "Installing VS Code via pacman..."
        install_package code
    else
        echo "No supported method to install VS Code. Please install manually."
        exit 1
    fi
}

# Detect the package manager
PACKAGE_MANAGER=$(detect_package_manager)
echo "$PACKAGE_MANAGER detected."

# Install VS Code (check for snap, otherwise use apt or pacman)
echo "Attempting to install VS Code"
install_code_editor

# Install Git and Node.js tools
echo "Attempting to install Git and Node.js"
install_package git npm

echo "Attempting to install Rust and PostgreSQL tools"
# Install Rust tools and source and PostgreSQL libraries
# Why are we downloading Rust source? That seems unnecessary...
if [ "$PACKAGE_MANAGER" = "apt" ]; then
    install_package rustc cargo rust-src pkg-config postgresql postgresql-contrib libpq-dev redis-server redis-tools docker.io docker-compose
elif [ "$PACKAGE_MANAGER" = "pacman" ]; then
    install_package rust cargo rust-src pkgconf postgresql postgresql-libs redis docker docker-compose
fi

echo "Attempting to install diesel_cli"
if cargo install --list | grep -q "diesel_cli"; then
   echo "diesel_cli is already installed via Cargo. Skipping."
else
   cargo install diesel_cli --no-default-features --features postgres
fi

# Install Rust development tools via Cargo, skip if already installed
echo "Attempting to install a bunch of Rust tools"
for cargo_pkg in tsync cargo-edit cargo-watch; do
    if cargo install --list | grep -q "$cargo_pkg"; then
        echo "$cargo_pkg is already installed via Cargo. Skipping."
    else
        cargo install "$cargo_pkg"
    fi
done

echo "Attempting to install Yarn"
# Install Yarn globally using npm, skip if already installed
if npm list -g yarn &> /dev/null; then
    echo "Yarn is already installed globally. Skipping."
else
    sudo npm install -g yarn
fi

echo "Updating nodejs"
# Ensure we have a recently updated nodejs
sudo npm install -g n
sudo n lts
NODE_VERSION=$(n ls)
echo "Node version: $NODE_VERSION"


# Add ~/.cargo/bin to the user's profile if it's not already there
PROFILE=$HOME/.profile
if ! grep 'cargo bin if' "$PROFILE"; then
   echo "Adding to the .profile the user's cargo bin"
   echo "# set PATH so it includes a users private cargo bin if it exists" >>~/.profile
   echo 'if [ -d "$HOME/.cargo/bin" ] ; then' >>~/.profile
   echo '    PATH="$HOME/.cargo/bin:$PATH"' >>~/.profile
   echo 'fi'  >>~/.profile
fi

echo "Installation complete!"
