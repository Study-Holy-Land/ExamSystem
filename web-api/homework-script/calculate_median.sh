#!/bin/bash

rm -rf ./easy-calculate

git clone https://github.com/simpletrain/easy-calculate.git

rm -rf  spec

mv easy-calculate/spec ./

jasmine
