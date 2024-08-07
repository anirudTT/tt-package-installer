#!/bin/bash

# Step 2: Download and install specific packages
echo "Step 2: Download and install specific packages"
wget http://mirrors.kernel.org/ubuntu/pool/main/y/yaml-cpp/libyaml-cpp-dev_0.6.2-4ubuntu1_amd64.deb
wget http://mirrors.kernel.org/ubuntu/pool/main/y/yaml-cpp/libyaml-cpp0.6_0.6.2-4ubuntu1_amd64.deb
dpkg -i libyaml-cpp-dev_0.6.2-4ubuntu1_amd64.deb libyaml-cpp0.6_0.6.2-4ubuntu1_amd64.deb
rm libyaml-cpp-dev_0.6.2-4ubuntu1_amd64.deb libyaml-cpp0.6_0.6.2-4ubuntu1_amd64.deb
apt install -y dkms
