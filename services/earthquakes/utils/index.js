'use strict';

const _ = require('lodash');
const geocluster = require('geocluster');

function calculateCentroid(coordsArr, bias) {
  if (coordsArr.length < 2) {
    return coordsArr[0];
  }

  const centroidObject = geocluster(coordsArr, bias);
  return _.get(centroidObject[0], 'centroid');
}

function getTotalMagnitude(arrayOfMagnitudes) {
  const BASE = 10;
  const totalMag = _.reduce(arrayOfMagnitudes, (total, magnitude) => {
    total += Math.pow(BASE, magnitude);
    return total;
  }, 0);

  return Math.log10(totalMag);
}

module.exports = {
  calculateCentroid,
  getTotalMagnitude
};
