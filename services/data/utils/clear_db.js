'use strict';

const persistenceManager = require('services/data/persistence_manager');

/**
 * This module is for development purposes only.
 */
return persistenceManager.sync({force: true})
.then(() => {
  console.log('DB Cleared');
  process.exit(0);
})
.catch(() => {
  console.log('error clearing db');
  process.exit(1);
});
