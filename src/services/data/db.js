'use strict';

const Sequelize = require('sequelize');
const config = require('config');

const dbOptions = {
  dialect: config.get('database').dialect,
  host: config.get('database').host,
  port: config.get('database').port,
  logging: false,
  pool: {
    maxConnections: 10
  }
};

module.exports = new Sequelize(
  config.get('database').database_name,
  config.get('database').user,
  config.get('database').password,
  dbOptions
);
