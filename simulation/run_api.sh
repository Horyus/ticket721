#! /bin/bash

cd ticket721-cacheserver

echo "#1 Start API"
env T721H_ADDRESS=`jq ".deployedAddress" ../ticket721-contracts/dist/contracts/Ticket721Hub.json | sed -e 's/^"//' -e 's/"$//'` T721C_DIST_PATH=`pwd`/../ticket721-contracts/dist T721_MASTER_ADDRESS="0xf8cf4531433b2ac4bdb2b84a9e350289eb7f467c" npm run dev
