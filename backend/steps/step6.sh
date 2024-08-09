#!/bin/bash

# Step 6: Install tt-kmd using dkms
echo "Step 6: Install tt-kmd using dkms"

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

# Install the necessary kernel headers
echo "Installing kernel headers..."
kernel_version=$(uname -r)
if apt-get update && apt-get install -y "linux-headers-$kernel_version"; then
    echo "Kernel headers installed successfully."
else
    echo "Couldn't find package for linux-headers-$kernel_version. Skipping installation."
fi

# Check if the DKMS module is already added
if dkms status | grep -q "tenstorrent/1.29"; then
    echo "Skipping DKMS add for tenstorrent-1.29 as it already exists."
else
    if dkms add .; then
        echo "DKMS add successful."
    else
        echo "DKMS add failed. Exiting."
        exit 1
    fi
fi

# Install the DKMS module
if dkms install tenstorrent/1.29; then
    echo "DKMS install successful."
else
    echo "DKMS install failed or module already exists. Skipping installation."
fi

# Load the module
if modprobe tenstorrent; then
    echo "Module tenstorrent loaded successfully."
else
    echo "Failed to load tenstorrent module. Please check if the module was installed correctly."
fi

echo "Completed installing tt-kmd using dkms"
