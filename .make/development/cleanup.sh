#!/bin/bash
set -e;

read -e -p "This will delete all your local byor-voting-server data, if any... are you sure to continue? [y/N] " response;
if [[ "${response:-n}" =~ [nN](es)* ]]; then
    echo "Aborting on user choice"
    exit 1;
fi

/bin/bash .make/utils/execute-in-docker.sh \
-d "rm" \
-o "-v -s -f"

/bin/bash .make/utils/execute-in-docker.sh \
-d "down" \
-o "-v"

read -e -p "Do you also want to remove node modules folder? [Y/n] " response;
if [[ "${response:-y}" =~ [yY](es)* ]]; then
    echo "Removing all installed node modules..."
    rm -rf node_modules
    echo "...done"
fi

read -e -p "Do you also want to remove all unused containers, volumes, networks and images (both dangling and unreferenced)? [y/N] " response;
if [[ "${response:-n}" =~ [yY](es)* ]]; then
    echo "Removing all unused containers, volumes, networks and images..."
    docker system prune --volumes -f
    echo "...done"
fi
