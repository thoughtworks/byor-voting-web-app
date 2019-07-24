#!/bin/bash
set -e;
if [ -z "${CI}" ]; then
    if [ -z $BYOR_ENV ]; then
        read -e -p "Please enter a target environment [local-dev]: " inByorEnv;
        export byorEnv="_${inByorEnv:-local-dev}"
    else
        export byorEnv="_${BYOR_ENV}"
    fi
    if [ -f "config/byor_${BYOR_ENV}.sh" ]; then
        echo "--[INFO]: Environment variables loaded from 'config/byor${byorEnv}.sh'"
        source config/byor${byorEnv}.sh
    else
        echo "--[ERROR]: missing configuration file for environment ${BYOR_ENV}!";
        exit 1;
    fi
else
    # aws
    vars="AWS_SERVICE_STAGE,AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY,AWS_REGION,MONGO_HOME,MONGO_HOST,MONGO_USER,MONGO_PWD,MONGO_AUTH_DB,MONGO_DB_NAME,MONGO_URI"
    IFS=',' read -r -a vars_list <<< "$vars"
    for var in ${vars_list[@]}; do 
        if [ -z "${BYOR_ENV}_${var}" ]; then 
            BYOR_ENV_VAR="${BYOR_ENV}_${var}"
            export "${var}"="${!BYOR_ENV_VAR}";
        else 
            export "${var}"="${!var}";
        fi
    done
fi