#!/bin/bash

# Step 7: Install tt-smi using pip3
echo "Step 7: Install tt-smi using pip3"

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
