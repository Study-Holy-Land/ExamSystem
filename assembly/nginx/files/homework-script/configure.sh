#!/bin/bash
rm -rf test-post
git clone https://github.com/purpletianjing/test-post.git 

rm -rf  spec

mv test-post/spec ./

jasmine
