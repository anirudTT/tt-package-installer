#!/bin/bash

set -e

# ANSI color codes
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NO_COLOR='\033[0m'

steps=("step1.sh" "step2.sh" "step3.sh" "step4.sh" "step5.sh" "step6.sh" "step7.sh" "step8.sh" "step9.sh" "step10.sh" "step11.sh")

for step in "${steps[@]}"; do
    echo -e "${CYAN}Running: $step${NO_COLOR}"
    bash "./steps/$step"
done

echo -e "${GREEN}All steps completed :)${NO_COLOR}"
