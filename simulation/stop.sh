#! /bin/bash

echo "#1 Stop Docker containers"
docker-compose -f simulation/docker-compose.yml down
