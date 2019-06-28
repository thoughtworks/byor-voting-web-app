#!/bin/bash
set -e;

BACKEND_SERVICE_URL=$(/bin/bash ./.make/utils/get-backend-service-url.sh)
RADAR_SERVICE_URL=$(/bin/bash ./.make/utils/get-radar-service-url.sh)

echo "Taget backend service: ${BACKEND_SERVICE_URL}"
echo "Taget radar service: ${RADAR_SERVICE_URL}"

BACKEND_SERVICE_URL="${BACKEND_SERVICE_URL}" RADAR_SERVICE_URL="${RADAR_SERVICE_URL}" /bin/bash .make/utils/execute-in-docker.sh \
-d "run" \
-c "npm run build" \
-s "byor-voting-web-app" \
-o "--rm"
