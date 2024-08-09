#!/bin/bash

# Step 3: Install Rust using rustup and source the environment
echo "Step 3: Install Rust using rustup and source the environment"

# Check if rustup is already installed
if command -v rustup &> /dev/null; then
    echo "Rustup is already installed, updating toolchain..."
    rustup update
else
    echo "Rustup is not installed, installing Rust using rustup..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

    # Configure the current shell to use rustup
    echo "Configuring the current shell to use the Rust environment..."
fi

# Source the Rust environment
if [ -f "$HOME/.cargo/env" ]; then
    source "$HOME/.cargo/env"
    echo "Rust environment sourced successfully. Rust is ready to use!"
else
    echo "Failed to find the Rust environment file. Please check your installation."
    exit 1
fi

# Optional: Generate and source a Python environment for luwen
echo "Optional: You may also want to generate and source a Python environment for the luwen library."
# Add commands here if you need to create and activate a Python virtual environment, e.g.:
# python3 -m venv /path/to/your/venv
# source /path/to/your/venv/bin/activate

echo "Rust installation and environment configuration completed successfully."
