'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const geohash = require('ngeohash');
const data = require('../../../../test_data.json');
const utils = require('services/earthquakes/utils');
const EarthQuakesModel = require('services/earthquakes/models');
const geocode = require('services/geocode');
const LOGGER_PREFIX = 'EARTHQUAKES SERVICE';

// Helper functions
function isPointWithInBoundingBox(pointCoords, boundingBoxCoords) {
  return boundingBoxCoords.min_lat <= pointCoords.lat &&
    pointCoords.lat <= boundingBoxCoords.max_lat &&
    boundingBoxCoords.min_long <= pointCoords.long &&
    pointCoords.long <= boundingBoxCoords.max_long;
}

function getBoundingBoxHashes(precision) {
  const precisionLevel = precision || 1;
  // min/max lat/long bounds of the world
  return geohash.bboxes(-85, -180, 85, 180, precisionLevel);
}

// Add sort direction
function sortByTotalMagnitude(earthQuakesArray) {
  const sortedArr = (earthQuakesArray.sort((a, b) => b.total_magnitude - a.total_magnitude));
  return Promise.resolve(sortedArr);
}

function getBoundingBoxCoordinates(boundingBoxHashes) {
  return _.map(boundingBoxHashes, hash => {
    const decodedBox = geohash.decode_bbox(hash);
    return {
      hash,
      min_lat: decodedBox[0],
      min_long: decodedBox[1],
      max_lat: decodedBox[2],
      max_long: decodedBox[3]
    };
  });
}

// Improvement: refactor to support flexible region groupings
function groupEarthQuakePointsByBoundingBoxes(points) {
  const hashBoxes = getBoundingBoxHashes(2);
  const boundingBoxCoords = getBoundingBoxCoordinates(hashBoxes);

  const pointsByBoundingHash = _.reduce(points, (accumulator, point) => {
    // for each point, check each bucket if it belongs there
    _.each(boundingBoxCoords, box => {
      if (isPointWithInBoundingBox(point, box)) {
        if (!accumulator[`${box.hash}`]) {
          accumulator[`${box.hash}`] = {};
          accumulator[`${box.hash}`].mags = [];
          accumulator[`${box.hash}`].coords = [];
        } else {
          accumulator[`${box.hash}`].mags.push(point.mag);
          accumulator[`${box.hash}`].coords.push([Number(point.lat), Number(point.long)]);
        }
      }
    });

    return accumulator;

  }, {});

  return Promise.resolve(pointsByBoundingHash);
}

function convertEarthQuakeKeyValueToArray(earthQuakeGroup) {
  const earthQuakeArray = _.reduce(earthQuakeGroup, (accumulator, group, key) => {
    const object = {}
    if (_.size(group.mags) !== 0) {
      object.bounding_box_geohash = key;
      object.coords = group.coords;
      object.mags = group.mags;
      object.centroid = utils.calculateCentroid(group.coords, 2);
      object.earth_quake_count = _.size(group.mags);
      object.total_magnitude = utils.getTotalMagnitude(group.mags);
    }

    if (!_.isEmpty(object)) {
      accumulator.push(object);
    }

    return accumulator;
  }, []);

  return Promise.resolve(earthQuakeArray);
}

function lookUpByMostPopulatedNearestCity(topList, options) {
  const limit = _.get(options, 'limit') || 10;
  // cushion in case centroids are in the middle of nowhere
  const list = topList.slice(0, limit + 10);

  return Promise.map(list, location => {
    const centroid = location.centroid;
    return geocode.getNearByCities({coordinates: centroid})
    .then(response => {
      // if there are nearby cities
      if (response[0].geoplugin_place) {
        return {
          nearest_populated_place: `${response[0].geoplugin_place}, ${response[0].geoplugin_countryCode}`,
          total_magnitude: location.total_magnitude,
          earth_quake_count: location.earth_quake_count
        };
      }
    });
  })
  .then(sortByTotalMagnitude)
  .then(finalList => finalList.slice(0, limit));
}

function fetchAllEarthQuakeData(options) {
  const numDays = _.get(options, 'number_of_days') || 30;
  const today = new Date();
  const backToDate = today.setDate(today.getDate() - numDays);

  return EarthQuakesModel.findAll({
    where: {
      earth_quake_time: {
        $lt: new Date(),
        $gt: new Date(backToDate)
      }
    },
    order: [['earth_quake_time', 'DESC']],
    raw: true
  });
}

function getTheLatestEarthQuakeRecord() {
  return EarthQuakesModel.findAll({
    order: [['earth_quake_time', 'DESC']],
    limit: 1,
    raw: true
  });
}

function persistNewEarthQuakeData(earthQuake) {
  return EarthQuakesModel.create({
    lat: _.get(earthQuake, 'geometry.coordinates')[1],
    long: _.get(earthQuake, 'geometry.coordinates')[0],
    usgs_id: earthQuake.id,
    mag: _.get(earthQuake, 'properties.mag') || 0,
    place: _.get(earthQuake, 'properties.place'),
    earth_quake_timestamp: _.get(earthQuake, 'properties.time'),
    earth_quake_time: _.get(earthQuake, 'properties.time'),
    timezone: _.get(earthQuake, 'properties.tz')
  });
}

function getEarthQuakes(options) {
  return fetchAllEarthQuakeData(options)
  .then(groupEarthQuakePointsByBoundingBoxes)
  .then(convertEarthQuakeKeyValueToArray)
  .then(sortByTotalMagnitude)
  .then(sortedList => lookUpByMostPopulatedNearestCity(sortedList, options))
  .catch(error => {
    const errorMessage = `${LOGGER_PREFIX} error fetching earth quakes`;
    console.log(errorMessage, error.stack);
    return Promise.reject(error);
  });
}

module.exports = {
  getEarthQuakes,
  persistNewEarthQuakeData,
  getTheLatestEarthQuakeRecord
};
