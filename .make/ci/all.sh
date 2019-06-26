#!/bin/bash
set -e;

export CI="true"

make install
make lint
make unit_tests
BACKEND_SERVICE_URL=http://localhost:3000/ RADAR_SERVICE_URL=https://radar.thoughtworks.com/ make build
