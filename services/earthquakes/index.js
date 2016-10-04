'use strict';

const earthQuakesController = require('services/earthquakes/controllers/earthquakes_controller.js');

module.exports = {
  getEarthQuakes: earthQuakesController.getEarthQuakes,
  persistNewEarthQuakeData: earthQuakesController.persistNewEarthQuakeData,
  getTheLatestEarthQuakeRecord: earthQuakesController.getTheLatestEarthQuakeRecord
};
