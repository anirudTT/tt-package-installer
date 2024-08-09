#!/bin/bash

# Function to log messages
log() {
    echo "$1"
    echo "$1" >> ~/step2.log
}

# Step 2: Download and install YAML-CPP
log "Step 2: Download and install YAML-CPP"

log "Updating package lists..."
apt-get update || { log "Failed to update package lists"; exit 1; }

log "Downloading libyaml-cpp-dev..."
wget http://mirrors.kernel.org/ubuntu/pool/main/y/yaml-cpp/libyaml-cpp-dev_0.6.2-4ubuntu1_amd64.deb || { log "Failed to download libyaml-cpp-dev"; exit 1; }

log "Downloading libyaml-cpp0.6..."
wget http://mirrors.kernel.org/ubuntu/pool/main/y/yaml-cpp/libyaml-cpp0.6_0.6.2-4ubuntu1_amd64.deb || { log "Failed to download libyaml-cpp0.6"; exit 1; }

log "Installing YAML-CPP packages..."
dpkg -i libyaml-cpp-dev_0.6.2-4ubuntu1_amd64.deb libyaml-cpp0.6_0.6.2-4ubuntu1_amd64.deb || { log "Failed to install YAML-CPP packages"; exit 1; }

log "Removing downloaded files..."
rm libyaml-cpp-dev_0.6.2-4ubuntu1_amd64.deb libyaml-cpp0.6_0.6.2-4ubuntu1_amd64.deb || { log "Failed to remove downloaded files"; exit 1; }

log "Installing dkms..."
apt-get install -y dkms || { log "Failed to install dkms"; exit 1; }

log "Installing cargo..."
apt-get install -y cargo || { log "Failed to install cargo"; exit 1; }

log "Step 2 completed successfully."
