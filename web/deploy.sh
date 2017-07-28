#!/usr/bin/env bash

set -eo pipefail
PS4="command: "
set -x
if [ -z $REMOTE_SERVER_IP ]
then
  echo "Please Set the REMOTE_SERVER_IP"
  exit 1
fi

npm install
rm -fr public/assets
./node_modules/.bin/webpack
cd public
zip -qr web.zip assets
scp web.zip $REMOTE_SERVER_IP:/home/ubuntu/twars
ssh -T $REMOTE_SERVER_IP 'rm -fr /home/ubuntu/twars/assets'
ssh -T $REMOTE_SERVER_IP 'unzip -qo /home/ubuntu/twars/web.zip -d /home/ubuntu/twars/'
ssh -T $REMOTE_SERVER_IP 'rm /home/ubuntu/twars/web.zip'
