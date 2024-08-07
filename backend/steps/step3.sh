#!/bin/bash

# Step 3: Install Rust using rustup
echo "Step 3: Install Rust using rustup"
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"
