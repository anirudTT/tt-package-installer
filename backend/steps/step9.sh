#!/bin/bash

# Step 9: Install tt-smi using pip3
echo "Step 9: Install tt-smi using pip3"

# Define the directory where the tt-smi repository is located
directory="/tmp/tenstorrent_repos/tt-smi"

# Check if the directory exists
if [ -d "$directory" ]; then
    cd "$directory"
    echo "Navigated to $directory"
else
    echo "Directory $directory does not exist. Exiting."
    exit 1
fi

# Install tt-smi using pip3
pip3 install .


# Step 9: Verify tt-smi installation
echo "Step 9: Verify tt-smi installation"

# Check if tt-smi is installed and available in the PATH
if command -v tt-smi &> /dev/null; then
    echo "tt-smi command found and working"
else
    echo "tt-smi command not found. Please check the installation."
    exit 1
fi
