#!/bin/sh

set -e  # Exit immediately if a command exits with a non-zero status

# Step 7: Install Rust and tt-flash
echo "Step 7: Install Rust and tt-flash"

# Define the virtual environment and the directory where the tt-flash repository is located
venv_path="/tmp/tenstorrent_repos/venv"
directory="/tmp/tenstorrent_repos/tt-flash"

# Check if required packages are installed
required_packages="python3-venv curl build-essential"
for package in $required_packages; do
    if ! dpkg -l | grep -q $package; then
        echo "Installing $package..."
        apt-get update && apt-get install -y $package
    fi
done

# Remove existing Rust installation
if [ -d "$HOME/.cargo" ]; then
    echo "Removing existing Rust installation..."
    rm -rf "$HOME/.cargo"
    rm -rf "$HOME/.rustup"
fi

# Install Rust
echo "Installing Rust..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable
export PATH="$HOME/.cargo/bin:$PATH"
rustup default stable
rustc --version
cargo --version

# Check if the virtual environment exists, create if not
if [ ! -d "$venv_path" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv "$venv_path"
    echo "Virtual environment created at $venv_path"
fi

# Activate the virtual environment
. "$venv_path/bin/activate"

# Set the path to the virtual environment's Python and pip
VENV_PYTHON="$venv_path/bin/python"
VENV_PIP="$venv_path/bin/pip"

# Upgrade pip and install wheel
$VENV_PIP install --upgrade pip wheel setuptools

# Check if the directory exists
if [ -d "$directory" ]; then
    cd "$directory"
    echo "Navigated to $directory"
else
    echo "Directory $directory does not exist. Exiting."
    exit 1
fi

# Install tt-flash using pip
echo "Installing tt-flash using pip..."
if ! $VENV_PIP install .; then
    echo "Failed to install tt-flash using pip"
    exit 1
fi

# Verify that tt-flash is installed and accessible
if ! "$venv_path/bin/tt-flash" -h; then
    echo "tt-flash -h command failed. Exiting."
    exit 1
fi

echo "Step 7 completed successfully: Rust and tt-flash installed."
