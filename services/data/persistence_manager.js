'use strict';

const db = require('./db.js');

// Load models
require('services/earthquakes/models');

function sync(options) {
  return db.sync(options)
  .catch((err) => console.log('[PERSISTENCE LAYER] database error', err));
}

module.exports = {
  sync
};
