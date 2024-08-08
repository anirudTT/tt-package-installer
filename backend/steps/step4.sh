#!/bin/bash

# Step 4: Clone Git repositories into tmp directory
echo "Step 4: Clone Git repositories into tmp directory"

# Directory to clone repositories into
clone_dir="/tmp/tenstorrent_repos"
mkdir -p "$clone_dir"

# List of repositories to clone
repo_urls="https://github.com/tenstorrent/tt-system-tools
https://github.com/tenstorrent/tt-kmd
https://github.com/tenstorrent/tt-firmware
https://github.com/tenstorrent/tt-flash
https://github.com/tenstorrent/tt-smi"

# Clone each repository
for repo in $repo_urls; do
    repo_name=$(basename "$repo" .git)
    target_dir="$clone_dir/$repo_name"

    if [ -d "$target_dir" ] && [ "$(ls -A "$target_dir")" ]; then
        echo "Skipping $repo_name as it already exists and is not empty."
    else
        echo "Cloning $repo_name into $target_dir..."
        git clone "$repo" "$target_dir"
    fi
done

echo "Step 4 completed successfully."
