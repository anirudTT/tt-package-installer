#!/bin/bash

# Step 3: Install Rust using rustup
echo "Step 3: Install Rust using rustup"

# Check if rustup is already installed
if command -v rustup &> /dev/null; then
    echo "Rustup is already installed, updating toolchain..."
    rustup update
else
    echo "Rustup is not installed, installing Rust using rustup..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

    # Configure the current shell to use rustup
    echo "Configuring the current shell to use the Rust environment..."
    if [ -f "$HOME/.cargo/env" ]; then
        source "$HOME/.cargo/env"
        echo "Rust environment configured. Rust is ready to use!"
    else
        echo "Failed to find the Rust environment file. Please check your installation."
        exit 1
    fi
fi
