#!/bin/bash

# Function to log messages
log() {
    echo "$1"
    echo "$1" >> /var/log/step1.log  # Log to a standard location within the container
}

# Step 1: System update and package installation
log "Step 1: System update and package installation"

log "Updating package lists..."
apt-get update || { log "Failed to update package lists"; exit 1; }

log "Removing existing nodejs and npm..."
apt-get remove -y nodejs npm || { log "Failed to remove existing nodejs and npm"; exit 1; }

log "Installing pciutils..."
apt-get install -y pciutils || { log "Failed to install pciutils"; exit 1; }

log "Updating packages..."
apt update -y || { log "Failed to update packages"; exit 1; }

log "Upgrading packages..."
apt upgrade -y --no-install-recommends || { log "Failed to upgrade packages"; exit 1; }

log "Installing Node.js and npm from NodeSource..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - || { log "Failed to add NodeSource repository"; exit 1; }
apt-get install -y nodejs || { log "Failed to install nodejs from NodeSource"; exit 1; }

log "Installing additional packages..."
apt install -y build-essential curl libboost-all-dev libgl1-mesa-glx libgoogle-glog-dev libhdf5-serial-dev ruby software-properties-common libzmq3-dev clang wget python3-pip python-is-python3 python3-venv git || { log "Failed to install additional packages"; exit 1; }

log "Step 1 completed successfully. :)"
