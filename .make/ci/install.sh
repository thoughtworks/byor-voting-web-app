#!/bin/bash
set -e;

/bin/bash .make/utils/execute-in-docker.sh \
-c "npm install" \
-s "byor-app" \
-o "--build --exit-code-from byor-app"
