#!/bin/bash
set -e

docker_compose_files=( "docker-compose.yml" )
services=( )
docker_compose_command="up"
while getopts ":c:f:s:o:d:" opt; do
    case ${opt} in
        c )
            command=${OPTARG};;
        o )
            docker_compose_options=${OPTARG};;
        f )
            docker_compose_files=( "${docker_compose_files[@]}" "${OPTARG}" );;
        s )
            services=( "${services[@]}" "${OPTARG}" );;
        d )
            docker_compose_command=${OPTARG};;
        \? )
            echo "Invalid Option: -${OPTARG}" 1>&2
            exit 1;;
        : )
            echo "Invalid Option: -${OPTARG} requires an argument" 1>&2
            exit 1;;
    esac
done

if [ ! -z "${CIRCLECI}" ]; then
    docker_compose_files=( "${docker_compose_files[@]}" "docker-compose.circle-ci.yml" )
fi

files_option=""
for docker_compose_file in "${docker_compose_files[@]}"; do
    files_option="${files_option} --file ${docker_compose_file}"
done

services_string=""
for service in "${services[@]}"; do
    services_string="${services_string} ${service}"
done

if [[ ${docker_compose_command} == up ]]; then
    docker-compose ${files_option} down
fi

APP_COMMAND="${command}" docker-compose ${files_option} ${docker_compose_command} ${docker_compose_options:-} ${services_string}
