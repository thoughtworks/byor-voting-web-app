#!/bin/bash
set -e;

fix=""
if [ -z "${CI}" ]; then
    read -e -p "Do you want to automatically try to fix lint errors? [y/N] " input_fix;
    if [[ ${input_fix} == y ]]; then
        fix=":fix"
    fi
fi

full_command="npm run lint${fix}"
echo "About to execute: ${full_command}"

/bin/bash .make/utils/execute-in-docker.sh \
-d "run" \
-c "${full_command}" \
-s "byor-voting-web-app" \
-o "--rm"
