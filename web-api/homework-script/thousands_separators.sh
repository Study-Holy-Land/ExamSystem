#!/bin/bash

rm -rf ./thousands_separators

git clone https://github.com/sialvsic/thousands_separators.git

rm -rf  spec

mv thousands_separators/spec ./

jasmine
