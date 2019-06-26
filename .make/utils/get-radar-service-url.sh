#!/bin/bash
set -e;

TW_SERVICE_URL='https://radar.thoughtworks.com/'
TEST_MANUAL_SERVICE_URL='http://build-your-own-radar.s3-website-us-east-1.amazonaws.com/'
if [ -z "${RADAR_SERVICE_URL}" ]; then
    PS3='Radar service URL: '
    options=("Official (${TW_SERVICE_URL})" "Dev (${TEST_MANUAL_SERVICE_URL})" "Custom")
    select opt in "${options[@]}"
    do
        case $opt in
            "Official (${TW_SERVICE_URL})")
                RADAR_SERVICE_URL="${TW_SERVICE_URL}"
                break
                ;;
            "Dev (${TEST_MANUAL_SERVICE_URL})")
                RADAR_SERVICE_URL="${TEST_MANUAL_SERVICE_URL}"
                break
                ;;
            "Custom")
                read -e -p "Insert custom URL: " input_radar_url;
                if [ -z ${input_radar_url} ]; then
                    echo "No URL was specified. Official (${TW_SERVICE_URL}) will be used."
                    RADAR_SERVICE_URL="${TW_SERVICE_URL}"
                else
                    RADAR_SERVICE_URL="${input_radar_url}"
                fi
                break
                ;;
            *) 
                echo "invalid option $REPLY"
                echo "No URL was specified. Local (${LOCAL_SERVICE_URL}) will be used."
                RADAR_SERVICE_URL="${LOCAL_SERVICE_URL}"
                break
                ;;
        esac
    done
fi

echo "${RADAR_SERVICE_URL}"
