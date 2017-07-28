#!/bin/sh

sed -i 's/localhost/mysql/g' ./api/src/main/resources/config.properties

cd api

./gradlew clean

./gradlew checkstyleMain

./gradlew jacoco test

./gradlew createCoberturaReport