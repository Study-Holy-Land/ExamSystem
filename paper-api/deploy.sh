#!/usr/bin/env bash

set -eo pipefail
PS4="command: "
set -x

if [ -z $REMOTE_SERVER_IP ]
then
  echo "Please Set the REMOTE_SERVER_IP"
  exit 1
fi

if [ -z $CONFIG_FILE_DIR ]
then
  echo "Please Set the CONFIG_FILE_DIR"
  exit 1
fi

if [ ! -f $CONFIG_FILE_DIR/config.properties ]
then
	echo "Failed with no config.properties in $CONFIG_FILE_DIR"
fi

if [ ! -f $CONFIG_FILE_DIR/$REMOTE_SERVER_IP.gradle.properties ]
then
	echo "Failed with no $REMOTE_SERVER_IP.gradle.properties in $CONFIG_FILE_DIR"
fi

ssh -T $REMOTE_SERVER_IP 'docker stop assembly_paper-api_1'

cp $CONFIG_FILE_DIR/config.properties src/main/resources/config.properties
./gradlew clean
./gradlew war
scp build/libs/paper-api.war $REMOTE_SERVER_IP:/home/ubuntu/twars/paper-api

cp $CONFIG_FILE_DIR/$REMOTE_SERVER_IP.gradle.properties ./config.properties
rm -rf src/test/resources/db/migration/*
./gradlew flywaymigrate

ssh -T $REMOTE_SERVER_IP 'docker start assembly_paper-api_1'

