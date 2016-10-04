'use strict';

const _ = require('lodash');
const http = require('superagent');
const Promise = require('bluebird');
const config = require('config/index.js');
const earthQuakesService = require('services/earthquakes/controllers/earthquakes_controller.js');
const USGS_URL = `${config.get('base_data_source_url')}${config.get('data_source_endpoint')}`;

// Promise support for superagent
http.Request.prototype.exec = function() {
  const self = this;
  return new Promise((resolve, reject) => {
    self.end((err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(res);
    });
  });
};

function getData() {
  return http
  .get(USGS_URL)
  .exec()
  .catch(err => console.log(err.stack));
}

function sync(latestTime, newEarthQuakeData) {
  return Promise.each(newEarthQuakeData, (data) => {
    const newTimeStamp = _.get(data, 'properties.time');
    if (newTimeStamp >= latestTime) {
      return earthQuakesService.persistNewEarthQuakeData(data);
    }

    // Improvement: refactor to avoid this pattern
    return Promise.reject(new Error('end_sync'));
  });

}

function checkForEarthQuakeDataUpdates() {
  console.log('Checking for USGS updates ...');
  let response, latestTimeStamp;
  return getData()
  .tap(data => {
    try {
      response = JSON.parse(data.text);
    } catch(error) {
      return Promise.reject(new Error('USGS request parse error'));
    }
  })
  .then(() => earthQuakesService.getTheLatestEarthQuakeRecord())
  .then(record => {
    // if db is empty
    if (_.isEmpty(record)) {
      return Promise.resolve();
    }

    const generatedTimeStamp = _.get(response, 'metadata.generated');
    latestTimeStamp = Number(_.first(record).earth_quake_timestamp);
    return generatedTimeStamp > latestTimeStamp;
  })
  .then(shouldUpdate => {
    if (shouldUpdate) {
      // sync
      console.log('Found new earthquake data, updating ...');
      return sync(latestTimeStamp, response.features)
      .catch(error => {
        if (error.message === 'end_sync') {
          console.log('Sync Complete!');
          return Promise.resolve();
        }
      });
    }

    console.log('No USGS new earthquake data');
    return Promise.resolve();
  });
}

module.exports = {
  checkForEarthQuakeDataUpdates
};
