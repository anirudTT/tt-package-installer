#!/bin/bash

# Step 8: Verify tt-smi installation
echo "Step 8: Verify tt-smi installation"
if command -v tt-smi &> /dev/null; then
    echo "tt-smi command found and working"
else
    echo "tt-smi command not found"
    exit 1
fi
