#!/bin/sh

set -e  # Exit immediately if a command exits with a non-zero status

# Step 7: Install Rust and tt-flash
echo "Step 7: Install Rust and tt-flash"

# Define the virtual environment, directory, and firmware path
venv_path="/tmp/tenstorrent_repos/venv"
tt_flash_repo="/tmp/tenstorrent_repos/tt-flash"
firmware_path="/tmp/tenstorrent_repos/tt-firmware/fw_pack-80.10.0.0.fwbundle"

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
echo "Activated virtual environment"

# Set the path to the virtual environment's Python and pip
VENV_PYTHON="$venv_path/bin/python"
VENV_PIP="$venv_path/bin/pip"

# Upgrade pip and install wheel
$VENV_PIP install --upgrade pip wheel setuptools

# Check if the tt-flash repository directory exists
if [ -d "$tt_flash_repo" ]; then
    cd "$tt_flash_repo"
    echo "Navigated to tt-flash repository at $tt_flash_repo"
else
    echo "tt-flash repository not found at $tt_flash_repo. Exiting."
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

# Step 8: Flash firmware using tt-flash
echo "Step 8: Flash firmware using tt-flash"

# Check if the firmware file exists
if [ -f "$firmware_path" ]; then
    echo "Firmware file found at $firmware_path"
else
    echo "Firmware file not found at $firmware_path. Exiting."
    exit 1
fi

# Flash the firmware using tt-flash
if ! "$venv_path/bin/tt-flash" flash --fw-tar "$firmware_path"; then
    echo "Firmware flash failed. Please check the process."
    exit 1
fi

echo "Step 8 flashing completed successfully."
