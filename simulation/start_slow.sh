#! /bin/bash

echo "#1 Start Docker containers"
docker-compose -f simulation/docker-compose-slow.yml up -d

echo "#2 Clean Embark env in Webapp"
cd ticket721-webapp && ../node_modules/.bin/embark reset && cd -

echo "#2 Clean Embark env in Contracts"
cd ticket721-contracts && ../node_modules/.bin/embark reset && cd -
