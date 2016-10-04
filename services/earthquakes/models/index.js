'use strict';

const Sequelize = require('sequelize');
const db = require('../../data/db');

const EarthQuakes = db.define('earthquakes', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  lat: {
    type: Sequelize.DECIMAL(10, 5),
    allowNull: false
  },
  long: {
    type: Sequelize.DECIMAL(10, 5),
    allowNull: false
  },
  usgs_id: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  mag: {
    type: Sequelize.DECIMAL(10, 5),
    allowNull: false
  },
  place: {
    type: Sequelize.STRING,
    allowNull: false
  },
  earth_quake_time: {
    type: Sequelize.DATE,
    allowNull: false
  },
  earth_quake_timestamp: {
    type: Sequelize.STRING,
    allowNull: false
  },
  timezone: {
    type: Sequelize.BIGINT
  }
}, {
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  setterMethods: {},
  getterMethods: {}
});

module.exports = EarthQuakes;
