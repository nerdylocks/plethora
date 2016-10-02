'use strict';

const _ = require('lodash');
const http = require('superagent');
const Promise = require('bluebird');
const geocluster = require('geocluster');
const geohash = require('ngeohash');
const data = require('./test_data.json');
const earthQuakes = _.get(data, 'features');

function addMags(arr) {
  const BASE = 10;
  const totalMag = _.reduce(arr, (acc, magnitude) => {
    acc += Math.pow(BASE, magnitude);
    return acc;
  }, 0);

  return Math.log10(totalMag);
}

function getTotalMag(totes) {
  return _.reduce(totes, (acc, element, key) => {
    acc[key] = {
      totes: addMags(element.mags)
    };

    return acc;
  }, {});
}

function getTransformedData(eqArray) {
  return _.map(eqArray, eq => {
    const coords = _.get(eq, 'geometry.coordinates');
    return {
      lat: coords[1],
      long: coords[0],
      usgs_id: eq.id,
      mag: _.get(eq, 'properties.mag'),
      place: _.get(eq, 'properties.place'),
      earth_quake_timestamp: _.get(eq, 'properties.time')
    };
  });
}

function isPointWithInBoundingBox(pointCoords, boundingBoxCoords) {
  return boundingBoxCoords.min_lat <= pointCoords.lat &&
    pointCoords.lat <= boundingBoxCoords.max_lat &&
    boundingBoxCoords.min_long <= pointCoords.long &&
    pointCoords.long <= boundingBoxCoords.max_long;
}

function checkEachPointAgainstABox(box, pointsArray) {
  return _.map(pointsArray, point => {
    if (isPointWithInBoundingBox(point, box)) {
      return {
        hash: box.hash,
        coords: [point.lat, point.long],
        mag: point.mag
      };
    }
  });
}

function getBoundingBoxHashes(precision) {
  const precisionLevel = precision || 1;
  // min/max lat/long bounds of the world
  return geohash.bboxes(-85, -180, 85, 180, precisionLevel);
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

const hashBoxes = getBoundingBoxHashes(3);
const boundingBoxCoords = getBoundingBoxCoordinates(hashBoxes);
const finalData = getTransformedData(earthQuakes);

function createBucket(points, boundingBoxes) {
  return _.reduce(points, (acc, point) => {
    // for each point, check each bucket if it belongs there
    _.each(boundingBoxes, box => {
      if (isPointWithInBoundingBox(point, box)) {
        if (!acc[`${box.hash}`]) {
          acc[`${box.hash}`] = {};
          acc[`${box.hash}`].mags = [];
          acc[`${box.hash}`].coords = [];
        } else {
          acc[`${box.hash}`].mags.push(point.mag);
          acc[`${box.hash}`].coords.push([point.lat, point.long]);
        }
      }
    });

    return acc;

  }, {});

}

const dataInBucket = createBucket(finalData, boundingBoxCoords);
console.log(JSON.stringify(dataInBucket, null, 2));
