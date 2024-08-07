#!/bin/bash

# Step 11: Install tt-kmd using dkms
echo "Step 11: Install tt-kmd using dkms"
cd ../tt-kmd
if dkms status | grep -q "tenstorrent/1.28"; then
    echo "Skipping DKMS add for tenstorrent-1.28 as it already exists."
else
    sudo dkms add .
fi
sudo dkms install tenstorrent/1.28 || echo "Skipping DKMS install for tenstorrent-1.28 as it already exists."
sudo modprobe tenstorrent
