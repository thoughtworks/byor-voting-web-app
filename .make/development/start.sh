#!/bin/bash
set -e;

BACKEND_SERVICE_URL=$(/bin/bash ./.make/utils/get-backend-service-url.sh)
RADAR_SERVICE_URL=$(/bin/bash ./.make/utils/get-radar-service-url.sh)

echo "Target backend service: ${BACKEND_SERVICE_URL}"
echo "Target radar service: ${RADAR_SERVICE_URL}"

BACKEND_SERVICE_URL="${BACKEND_SERVICE_URL}" RADAR_SERVICE_URL="${RADAR_SERVICE_URL}" /bin/bash ./.make/utils/execute-in-docker.sh \
-c "npm run start" \
-o "--exit-code-from byor-voting-web-app"
