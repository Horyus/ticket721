#! /bin/bash

cd simulation/

echo "#1 Run Verified populator"
env BC_URL=http://localhost:8545 DIST_PATH=`pwd`/../ticket721-contracts/dist ../node_modules/.bin/jest -c jestrc.json --runInBand
