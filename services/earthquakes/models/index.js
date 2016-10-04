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
    allowNull: false
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
    type: Sequelize.STRING
  }
}, {
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  setterMethods: {},
  getterMethods: {
    earth_quake_timestamp: function() {
      return Number(this.getDataValue('earth_quake_timestamp'));
    }
  }
});

module.exports = EarthQuakes;
