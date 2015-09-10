/**
 * Created by farooqhameed on 8/14/15.
 */
var Location = require('../models/Location');

module.exports = {
  getLocationByName: getLocationByName,
  addNewLocation: addNewLocation,
  getAllLocations: getAllLocations
};


function getLocationByName(name, callback) {
  Location.findByName(name, function (err, location) {
    if (err) {
      err.applicationErrorCode = 'LOCATION_NOT_FOUND';
      callback(err, null);
    } else {
      if (location) {
        callback(null, location);
      } else {
        var error = new Error();
        error.applicationErrorCode = 'LOCATION_NOT_FOUND';
        callback(error, null);
      }
    }
  });
}

function addNewLocation(name, latitude, longitude, callback) {
  Location.save(name, latitude, longitude, function (err, location) {
    if (err) {
      err.applicationErrorCode = 'LOCATION_NOT_SAVED';
      callback(err, null);
    } else {
      callback(null, location);
    }
  });
}

function getAllLocations(callback){
  Location.find({}, function (err, locations) {
    if (err) {
      err.applicationErrorCode = 'LOCATION_NOT_SAVED';
      callback(err, null);
    } else {
      callback(null, locations);
    }

  });
}
