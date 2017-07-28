#!/usr/bin/env bash

set -eo pipefail


cp $CONFIG_FILE_DIR/config.properties paper-api/src/main/resources/config.properties

function section() {
	printf "\e[32m $1"
	echo -e "\033[0m"
}

section "Assembling paper-api"

cd paper-api
./gradlew clean
./gradlew war
cd -

cp paper-api/build/libs/paper-api.war assembly/.release

section "Assembling web-api"

cd web-api
npm install
cd -
cp -r web-api assembly/.release
cd assembly/.release
zip -qr web-api.zip web-api
rm -fr web-api
cd -

# web
section "Assembling web"

rm -fr web/public/
cd web
npm install
./node_modules/.bin/webpack
cd -
cp -r web/public/assets assembly/.release
cd assembly/.release
zip -qr web.zip assets
rm -fr assets
cd -

# task-queue

section "Assembling task-queue"

cd task-queue
npm install
cd -
cp -r task-queue assembly/.release
cd assembly/.release
zip -qr task-queue.zip task-queue
rm -fr task-queue
cd -

# docker container
