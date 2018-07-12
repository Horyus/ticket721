#! /bin/bash

echo "#1 Import config"
npm run simulation:import_config

cd ticket721-webapp

export NODE_ENV=development

echo "#2 Start WebApp"
npm run build
npm run serve
