#!/bin/bash

# Step 5: Run hugepages-setup.sh script
echo "Step 5: Run hugepages-setup.sh script"
cd tt-system-tools
chmod +x ./hugepages-setup.sh
sudo ./hugepages-setup.sh
