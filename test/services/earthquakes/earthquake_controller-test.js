'use strict';

const _ = require('lodash');
const assert = require('assert');
const usgsDataFixture = require('../../fixtures/usgs_response.json').features;
const groupedDataFixture = require('../../fixtures/grouped_data.json');
const earthQuakeServiceControllers = require('services/earthquakes/controllers/earthquakes_controller.js');

// Util
function transformRawDataToDbData(fixture) {
  return _.map(fixture, earthQuake => {
    return {
      lat: _.get(earthQuake, 'geometry.coordinates')[1],
      long: _.get(earthQuake, 'geometry.coordinates')[0],
      usgs_id: earthQuake.id,
      mag: _.get(earthQuake, 'properties.mag') || 0,
      place: _.get(earthQuake, 'properties.place'),
      earth_quake_timestamp: _.get(earthQuake, 'properties.time'),
      earth_quake_time: _.get(earthQuake, 'properties.time'),
      timezone: _.get(earthQuake, 'properties.tz')
    };
  });
}

describe('Earthquake Service Controller', () => {
  describe('groupEarthQuakePointsByBoundingBoxes', () => {
    it('should correctly group by bounding boxes', done => {
      const fixture = transformRawDataToDbData(usgsDataFixture);
      return earthQuakeServiceControllers.groupEarthQuakePointsByBoundingBoxes(fixture)
      .then(response => {
        const expected = groupedDataFixture;
        assert.deepEqual(response, expected);
        done();
      })
      .catch(() => done());
    });
  });
});
