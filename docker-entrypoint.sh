#!/bin/sh
set -e;

echo "Backend service url is being set to: ${BACKEND_SERVICE_URL}"
echo "Radar service url is being set to: ${RADAR_SERVICE_URL}"

find ${NGINX_BASE_DIR} -type f | xargs sed -i  "s|${BACKEND_SERVICE_URL_PLACEHOLDER}|${BACKEND_SERVICE_URL}|g"
find ${NGINX_BASE_DIR} -type f | xargs sed -i  "s|${RADAR_SERVICE_URL_PLACEHOLDER}|${RADAR_SERVICE_URL}|g"

exec "$@"
