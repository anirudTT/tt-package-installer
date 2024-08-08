#!/bin/bash

# Step 6: Verify hugepages setup
echo "Step 6: Verify hugepages setup"

# Check if HugePages_Total exists in /proc/meminfo
if grep -q HugePages_Total /proc/meminfo; then
    echo "Completed hugepage setup"
else
    echo "Hugepage setup failed"
    exit 1
fi
