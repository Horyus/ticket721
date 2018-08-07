#! /bin/bash

echo "#1 Import config"
npm run simulation:import_config

cd ticket721-webapp

export NODE_ENV=production

echo "#2 Start WebApp"
npm run build:production
npm run serve:production
