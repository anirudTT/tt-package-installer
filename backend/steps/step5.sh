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

# Run the script to setup hugepages
./hugepages-setup.sh

echo "Completed running hugepages-setup.sh script"

echo "Step 6: Verify hugepages setup"

# Check if HugePages_Total exists in /proc/meminfo
if grep -q HugePages_Total /proc/meminfo; then
    echo "Completed hugepage setup"
else
    echo "Hugepage setup failed"
    exit 1
fi
echo "Hugepage setup verified"
