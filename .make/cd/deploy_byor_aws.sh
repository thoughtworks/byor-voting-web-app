#!/bin/bash
set -e;

source .make/utils/get_byor_env.sh

read -e -p "Please enter the byor project folder [../build-your-own-radar]: " inByorPath;

byorPath="${inByorPath:-../build-your-own-radar}"
s3Path="${AWS_SERVICE_STAGE}--byor-voting-web-app"
cwd=$(pwd)

echo "Building BYOR from ${byor}"
cd "${byorPath}"
npm install
npm run build
cd "${cwd}"
mkdir -p dist/byor
rm -rf dist/byor/*
cp -r "${byorPath}/dist/" dist/byor

echo "Deploying ${byor} to bucket: ${s3Path} and region: ${AWS_REGION}"

credentials_file="/root/.aws/credentials"
read -d '' final_command << EOF || true
mkdir -p $(dirname ${credentials_file});
touch ${credentials_file};
echo '[default]' > ${credentials_file};
echo 'aws_access_key_id=${AWS_ACCESS_KEY_ID}' >> ${credentials_file};
echo 'aws_secret_access_key=${AWS_SECRET_ACCESS_KEY}' >> ${credentials_file};
aws s3 rm s3://${s3Path}/ --recursive
aws s3 cp dist/byor s3://${s3Path}/ --recursive
EOF

/bin/bash .make/utils/execute-in-docker.sh \
-d "run" \
-c "/bin/bash -c \"${final_command}\"" \
-s "byor-voting-web-app" \
-o "--rm"
