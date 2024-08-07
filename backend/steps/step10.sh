#!/bin/bash

# Step 10: Flash firmware using tt-flash
echo "Step 10: Flash firmware using tt-flash"
firmware_path="$HOME/tmp/tt-firmware/fw_pack-80.10.0.0.fwbundle"
tt-flash flash --fw-tar $firmware_path
