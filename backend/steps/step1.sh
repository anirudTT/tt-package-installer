#!/bin/bash

# Step 1: System update and package installation
echo "Step 1: System update and package installation"
apt-get update
apt-get install -y pciutils
apt update -y
apt upgrade -y --no-install-recommends
apt install -y nodejs npm build-essential curl libboost-all-dev libgl1-mesa-glx libgoogle-glog-dev libhdf5-serial-dev ruby software-properties-common libzmq3-dev clang wget python3-pip python-is-python3 python3-venv git
