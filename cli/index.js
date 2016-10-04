#!/usr/bin/env node

const program = require('commander');
const peristenceManager = require('services/data/persistence_manager.js');
const earthQuakesService = require('services/earthquakes');
const syncService = require('services/sync');
require('console.table');

program
.option('-l, --limit <limit>', 'Number of most dangerous places to list (default=10)', parseInt)
.option('-d, --days <days>', 'Number days to go back to analyze data from (default=30)', parseInt)
.parse(process.argv);

// ensure database is ready
return peristenceManager.sync()
.then(() => syncService.checkForEarthQuakeDataUpdates())
.then(() => earthQuakesService.getEarthQuakes({
  limit: program.limit,
  number_of_days: program.days
}))
.then(console.table)
.then(() => process.exit(0))
.catch(error => {
  console.log('Error retrieving data', error.stack);
  process.exit(1);
});
