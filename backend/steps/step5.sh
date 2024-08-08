#!/bin/bash

# Step 5: Run hugepages-setup.sh script
echo "Step 5: Run hugepages-setup.sh script"

# Define the directory where the script should be located
directory="/tmp/tenstorrent_repos/tt-system-tools"

# Check if the directory exists
if [ -d "$directory" ]; then
    cd "$directory"
    echo "Navigated to $directory"
else
    echo "Directory $directory does not exist. Exiting."
    exit 1
fi

# Ensure the script is executable
chmod +x ./hugepages-setup.sh

# Run the script with sudo
sudo ./hugepages-setup.sh
