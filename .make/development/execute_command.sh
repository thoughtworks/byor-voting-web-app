#!/bin/bash
set -e;

if [ -z "${command}" ]; then
    read -e -p "Please enter command you wnat to execute: " input_command;
    if [[ ! -n "${input_command// /}" ]]; then
        echo "ERROR: command is empty!"
        exit 1;
    fi
    command="${input_command}"
fi

echo "About to execute \"${command}\" in byor-app container"
/bin/bash .make/utils/execute-in-docker.sh \
-d "run" \
-c "${command}" \
-s "byor-app" \
-o "--rm"
