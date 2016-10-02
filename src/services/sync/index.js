'use strict';

const _ = require('lodash');
const http = require('superagent');
const Promise = require('bluebird');
const config = require('../config');

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
  .catch(err => console.log(err.stack));
}

module.exports = {
  getData
};
