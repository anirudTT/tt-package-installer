#!/bin/bash

# Step 10: Install tt-flash using pip
echo "Step 10: Install tt-flash using pip"

# Define the directory where the tt-flash repository is located
directory="/tmp/tenstorrent_repos/tt-flash"

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
pip install . || { echo "Failed to install tt-flash using pip"; exit 1; }

echo "Step 10 flashing completed successfully."
