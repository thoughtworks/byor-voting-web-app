#!/bin/bash
set -e;

LOCAL_SERVICE_URL='http://localhost:3000/'
TEST_MANUAL_SERVICE_URL='https://a818nmuza6.execute-api.us-east-1.amazonaws.com/manualTest/executeService/'
if [ -z "${BACKEND_SERVICE_URL}" ]; then
    PS3='Backend service URL: '
    options=("Local (${LOCAL_SERVICE_URL})" "Dev (${TEST_MANUAL_SERVICE_URL})" "Custom")
    select opt in "${options[@]}"
    do
        case $opt in
            "Local (${LOCAL_SERVICE_URL})")
                BACKEND_SERVICE_URL="${LOCAL_SERVICE_URL}"
                break
                ;;
            "Dev (${TEST_MANUAL_SERVICE_URL})")
                BACKEND_SERVICE_URL="${TEST_MANUAL_SERVICE_URL}"
                break
                ;;
            "Custom")
                read -e -p "Insert custom URL: " input_backend_url;
                if [ -z ${input_backend_url} ]; then
                    echo "No URL was specified. Local (${LOCAL_SERVICE_URL}) will be used."
                    BACKEND_SERVICE_URL="${LOCAL_SERVICE_URL}"
                else
                    BACKEND_SERVICE_URL="${input_backend_url}"
                fi
                break
                ;;
            *) 
                echo "invalid option $REPLY"
                echo "No URL was specified. Local (${LOCAL_SERVICE_URL}) will be used."
                BACKEND_SERVICE_URL="${LOCAL_SERVICE_URL}"
                break
                ;;
        esac
    done
fi

echo "${BACKEND_SERVICE_URL}"
