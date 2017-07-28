#!/usr/bin/env bash

BASE_DIR=$(dirname $0)

scp $BASE_DIR/.data/jenkins/config.xml $REMOTE_SERVER_IP:/home/ubuntu/twars

cat > remote_script << EOM
  exist="\$(curl -I -X HEAD http://localhost:8088/job/HOMEWORK-SCORING 2>/dev/null  | head -n 1 | cut -d$' ' -f2)"
  if [ "\$exist" == 302 ]
  then
    curl -X POST http://localhost:8088/job/HOMEWORK-SCORING/doDelete
  fi
  curl -X POST http://localhost:8088/createItem?name\=HOMEWORK-SCORING --data-binary "@/home/ubuntu/twars/config.xml" -H "Content-Type:text/xml"
EOM

ssh $REMOTE_SERVER_IP 'bash -s' < remote_script
rm remote_script
