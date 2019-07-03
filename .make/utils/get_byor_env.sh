#!/bin/bash
set -e;

if [ -z $BYOR_ENV ]; then
    read -e -p "Please enter a target environment [local-dev]: " inByorEnv;
    export byorEnv="_${inByorEnv:-local-dev}"
else
    export byorEnv="_${BYOR_ENV}"
fi
echo "--[INFO]: Environment variables loaded from 'config/byor${byorEnv}.sh'"
source config/byor${byorEnv}.sh
