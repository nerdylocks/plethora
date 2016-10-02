'use strict';

const syncService = require('../../../src/services/sync');

describe('SyncService', () => {
  it('should get raw USGS data', done => {
    return syncService
    .then(data => {
      console.log(data);
      done();
    });
  });
});
