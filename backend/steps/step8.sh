#!/bin/bash

# Step 8: Verify tt-smi installation
echo "Step 8: Verify tt-smi installation"

# Check if tt-smi is installed and available in the PATH
if command -v tt-smi &> /dev/null; then
    echo "tt-smi command found and working"
else
    echo "tt-smi command not found. Please check the installation."
    exit 1
fi
