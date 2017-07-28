#!/bin/bash

rm -rf ./collection

git clone https://github.com/AnliHuer/collection.git

rm -rf spec

mv collection/spec ./

jasmine
