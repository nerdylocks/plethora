'use strict';

const nconf = require('nconf');
const pathToRoot = __dirname + '/../../';

const config = nconf
  .argv()
  .env()
  .file({file: `${pathToRoot}config.json`});

nconf.defaults({
  base_data_source_url: 'http://earthquake.usgs.gov',
  data_source_endpoint: '/earthquakes/feed/v1.0/summary/all_month.geojson',
  last_generated: '',
  latest_earthquake_record: '', // to avoid unnecessary database,
  database: {
    driver: 'pg',
    dialect: 'postgres',
    database_name: 'earthquakes_db',
    user: 'plethora_db_admin',
    password: 'password',
    host: 'localhost',
    port: '5432',
    logging: false
  }
});

module.exports = config;
