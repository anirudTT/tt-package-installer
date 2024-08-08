
#!/bin/bash

# Step 9: Install tt-kmd using dkms
echo "Step 9: Install tt-kmd using dkms"

# Define the directory where the tt-kmd repository is located
directory="/tmp/tenstorrent_repos/tt-kmd"

# Check if the directory exists
if [ -d "$directory" ]; then
    cd "$directory"
    echo "Navigated to $directory"
else
    echo "Directory $directory does not exist. Exiting."
    exit 1
fi

# Get the current kernel version
kernel_version=$(uname -r)

# Install the necessary kernel headers
echo "Installing kernel headers for $kernel_version..."
sudo apt-get update
sudo apt-get install -y "linux-headers-$kernel_version"

# Check if the DKMS module is already added
if dkms status | grep -q "tenstorrent/1.28"; then
    echo "Skipping DKMS add for tenstorrent-1.28 as it already exists."
else
    sudo dkms add .
fi

# Install the DKMS module
sudo dkms install tenstorrent/1.28 || echo "Skipping DKMS install for tenstorrent-1.28 as it already exists."

# Load the module
sudo modprobe tenstorrent || echo "Failed to load tenstorrent module. Please check if the module was installed correctly."
