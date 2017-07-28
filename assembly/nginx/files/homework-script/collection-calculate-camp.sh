#!/bin/bash

rm -rf ./empty-flaten

git clone https://github.com/wengjiaojiao/empty-flaten.git

rm -rf  spec
rm -rf specs

mv empty-flaten/specs ./
mv empty-flaten/spec ./

jasmine
