#!/bin/bash

# Step 4: Clone Git repositories into tmp directory
echo "Step 4: Clone Git repositories into tmp directory"
repos=(
    "https://github.com/tenstorrent/tt-system-tools"
    "https://github.com/tenstorrent/tt-kmd"
    "https://github.com/tenstorrent/tt-firmware"
    "https://github.com/tenstorrent/tt-flash"
    "https://github.com/tenstorrent/tt-smi"
)
for repo in "${repos[@]}"; do
    if [ -d "$repo_name" ] && [ "$(ls -A $repo_name)" ]; then
        echo -e "${CYAN}Skipping $repo_name as it already exists and is not empty.${NO_COLOR}"
    else
        echo -e "${CYAN}Running: git clone $repo${NO_COLOR}"
        git clone $repo
    fi
done
