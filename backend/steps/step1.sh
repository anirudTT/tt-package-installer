#!/bin/bash

# Function to log messages
log() {
    echo "$1"
    echo "$1" >> ~/step1.log
}

# Step 1: System update and package installation
log "Step 1: System update and package installation"

log "Updating package lists..."
sudo apt-get update

log "Removing existing nodejs and npm..."
sudo apt-get remove -y nodejs npm || { log "Failed to remove existing nodejs and npm"; exit 1; }

log "Installing pciutils..."
sudo apt-get install -y pciutils || { log "Failed to install pciutils"; exit 1; }

log "Updating packages..."
sudo apt update -y || { log "Failed to update packages"; exit 1; }

log "Upgrading packages..."
sudo apt upgrade -y --no-install-recommends || { log "Failed to upgrade packages"; exit 1; }

log "Installing Node.js and npm from NodeSource..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - || { log "Failed to add NodeSource repository"; exit 1; }
sudo apt-get install -y nodejs || { log "Failed to install nodejs from NodeSource"; exit 1; }

log "Installing additional packages..."
sudo apt install -y build-essential curl libboost-all-dev libgl1-mesa-glx libgoogle-glog-dev libhdf5-serial-dev ruby software-properties-common libzmq3-dev clang wget python3-pip python-is-python3 python3-venv git || { log "Failed to install additional packages"; exit 1; }

log "Step 1 completed successfully."
