#! /bin/sh

npm run simulation:stop
npm run simulation:start
sleep 15
npm run simulation:deploy
npm run simulation:populate_two
npm run simulation:import_config
npm run simulation:run_api
