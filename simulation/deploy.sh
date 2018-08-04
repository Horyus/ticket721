#! /bin/bash

cd ticket721-contracts

echo "#1 Deploy Contracts"
node ./tests/upload.js ./tests/event_metadata.json
../node_modules/.bin/embark build
