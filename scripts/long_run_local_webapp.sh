#! /bin/sh

npm run simulation:stop
npm run simulation:start
sleep 15
npm run simulation:deploy
npm run simulation:populate_one
npm run simulation:populate_two
npm run simulation:import_config
cd ticket721-webapp && ../node_modules/.bin/embark run --nodashboard
