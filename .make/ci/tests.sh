#!/bin/bash
set -e;
if [ -z $BACKEND_SERVICE_URL ]; then
    export BACKEND_SERVICE_URL=http://host.docker.internal:3000/
fi


watch=""
if [ -z "${CI}" ]; then
    read -e -p "Do you want to run tests in watch mode? [Y/n] " input_watch;
    if [[ ! ${input_watch} == n ]]; then
        watch=":watch"
    fi
fi

full_command="npm run ${test_script}${watch}"
echo "About to execute: ${full_command}"

case "${test_script}" in
    test)
        /bin/bash .make/utils/execute-in-docker.sh \
        -c "${full_command}" \
        -s "byor-app" \
        -o "--exit-code-from byor-app";;
    *)
        echo "ERROR: ${test_script} is not supported"
        exit 1;;
esac
