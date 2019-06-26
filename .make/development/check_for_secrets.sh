#!/bin/bash
set -e;

echo "About to run secret disclosure checks with Talisman..."
docker run \
       -it \
       --rm \
       -v "$PWD:/usr/src" \
       -v /usr/src/node_modules/ \
       -v /usr/src/.git/ \
       -v /usr/src/dist \
       byoritaly/talisman-checks-runner:0.4.6 \
       /bin/bash -c "git init &> /dev/null && talisman --pattern \"**\""
echo "...no secrets found, ok!"
