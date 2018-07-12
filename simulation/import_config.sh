#! /bin/bash

cp ./ticket721-contracts/chains.json ./ticket721-webapp/chains.json
cp -r ./ticket721-contracts/dist ./ticket721-webapp/
cp -r ./ticket721-contracts/.embark ./ticket721-webapp/.embark

#TMP
cp ./simulation/manifest.js ./ticket721-webapp/

