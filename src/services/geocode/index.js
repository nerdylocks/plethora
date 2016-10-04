'use strict';

const _ = require('lodash');
const http = require('superagent');
const Promise = require('bluebird');
const BASE_URL = 'http://www.geoplugin.net/extras/nearby.gp?';
const LOGGER_PREFIX = 'GEOCODING SERVICE';

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

// Helper functions
function buildQuery(query) {
  if (!query) {
    const errorMessage = `${LOGGER_PREFIX} invalid query object`;
    console.error(errorMessage);
    return Promise.reject(new Error(errorMessage));
  }

  return {
    lat: query.coordinates[0],
    long: query.coordinates[1],
    radius: query.radius || 100,
    format: 'json'
  };
}

function getNearByCities(query) {
  return http.get(BASE_URL)
    .query(buildQuery(query))
    .exec()
    .delay(500)
    .then(res => {
      let response;

      try {
        response = JSON.parse(res.text);
      } catch (err) {
        const errorMessage = `${LOGGER_PREFIX} response parse error`;
        console.error(errorMessage);
        return Promise.reject(new Error(errorMessage));
      }

      return response;
    })
    .catch(error => {
      const errorMessage = `${LOGGER_PREFIX} request error`;
      console.error(errorMessage, error);
      return Promise.reject(new Error(errorMessage));
    });
}

module.exports = {
  getNearByCities
};
