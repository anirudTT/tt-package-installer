#!/bin/bash

set -e

# ANSI color codes
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NO_COLOR='\033[0m'

# Function to run commands and show progress
run_command() {
    echo -e "${CYAN}Running: $1${NO_COLOR}"
    eval $1
}

# Function to clone repositories, skipping if directory already exists and is not empty
clone_repo() {
    local repo_url=$1
    local repo_name=$(basename "$repo_url" .git)

    if [ -d "$repo_name" ] && [ "$(ls -A $repo_name)" ]; then
        echo -e "${CYAN}Skipping $repo_name as it already exists and is not empty.${NO_COLOR}"
    else
        run_command "git clone $repo_url"
    fi
}

# Check hugepages function
check_hugepages() {
    if grep -q HugePages_Total /proc/meminfo; then
        echo -e "${GREEN}Completed hugepage setup${NO_COLOR}"
    else
        echo -e "${CYAN}Hugepage setup failed${NO_COLOR}"
        exit 1
    fi
}

# Check tt-smi function
check_tt_smi() {
    if command -v tt-smi &> /dev/null; then
        echo -e "${GREEN}tt-smi command found and working${NO_COLOR}"
    else
        echo -e "${CYAN}tt-smi command not found${NO_COLOR}"
        exit 1
    fi
}

main() {
    home_dir="$HOME"
    tmp_dir="$home_dir/tmp"
    total_steps=11
    step=0

    # Create tmp directory if it doesn't exist
    if [ ! -d "$tmp_dir" ]; then
        mkdir -p "$tmp_dir"
    fi

    # Change current working directory to tmp
    cd "$tmp_dir"

    step=$((step + 1))
    echo -e "${GREEN}Step $step/$total_steps: System update and package installation${NO_COLOR}"
    echo "__________________________________________"
    run_command "apt-get update"
    run_command "apt-get install -y pciutils"
    run_command "apt update -y"
    run_command "apt upgrade -y --no-install-recommends"
    run_command "apt install -y build-essential curl libboost-all-dev libgl1-mesa-glx libgoogle-glog-dev libhdf5-serial-dev ruby software-properties-common libzmq3-dev clang wget python3-pip python-is-python3 python3-venv git"
    echo -e "${GREEN}Step $step/$total_steps completed.${NO_COLOR}"
    echo "__________________________________________"

    step=$((step + 1))
    echo -e "${GREEN}Step $step/$total_steps: Download and install specific packages${NO_COLOR}"
    echo "__________________________________________"
    run_command "wget http://mirrors.kernel.org/ubuntu/pool/main/y/yaml-cpp/libyaml-cpp-dev_0.6.2-4ubuntu1_amd64.deb"
    run_command "wget http://mirrors.kernel.org/ubuntu/pool/main/y/yaml-cpp/libyaml-cpp0.6_0.6.2-4ubuntu1_amd64.deb"
    run_command "dpkg -i libyaml-cpp-dev_0.6.2-4ubuntu1_amd64.deb libyaml-cpp0.6_0.6.2-4ubuntu1_amd64.deb"
    run_command "rm libyaml-cpp-dev_0.6.2-4ubuntu1_amd64.deb libyaml-cpp0.6_0.6.2-4ubuntu1_amd64.deb"
    run_command "apt install -y dkms"
    echo -e "${GREEN}Step $step/$total_steps completed.${NO_COLOR}"
    echo "__________________________________________"

    step=$((step + 1))
    echo -e "${GREEN}Step $step/$total_steps: Install Rust using rustup${NO_COLOR}"
    echo "__________________________________________"
    run_command "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y"
    run_command 'source "$HOME/.cargo/env"'
    echo -e "${GREEN}Step $step/$total_steps completed.${NO_COLOR}"
    echo "__________________________________________"

    step=$((step + 1))
    echo -e "${GREEN}Step $step/$total_steps: Clone Git repositories into tmp directory${NO_COLOR}"
    echo "__________________________________________"
    repos=(
        "https://github.com/tenstorrent/tt-system-tools"
 
