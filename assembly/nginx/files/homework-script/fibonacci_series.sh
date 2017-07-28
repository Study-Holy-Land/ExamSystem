#!/bin/bash

rm -rf fibonacci_series

git clone https://github.com/sialvsic/fibonacci_series.git

rm -rf  spec

mv fibonacci_series/spec ./

jasmine
