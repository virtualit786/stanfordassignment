/**
 * Created by farooqhameed on 8/14/15.
 */

var async = require('async');
var userService = require('./userService');
var locationService = require('./locationService');
var Checkin = require('../models/Checkin');

module.exports = {
  checkin: checkin,
  getAllCheckins: getAllCheckins
};

/**
 *  Funds User and Locations objects from mongodb collections in parallel
 * **/
function findUserAndLocationInParallel(userName, locationName, callback) {
  async.parallel({
    user: function (callback) {
      userService.getUserByName(userName, function (err, user) {
        callback(err, user);
      });
    },
    location: function (callback) {
      locationService.getLocationByName(locationName, function (err, location) {
        callback(err, location);
      });
    }
  }, function (err, results) {
    callback(err, results);
  })
}

function checkin(userName, locationName, callback) {

  findUserAndLocationInParallel(userName, locationName, function (err, results) {
    if (err) {
      callback(err, null);
    } else {
      Checkin.save(results.user._id, results.location._id, function (err, checkinSaved) {
        if (err) {
          err.applicationErrorCode = 'CHECKIN_FAILED';
          callback(err, null);
        }
        callback(null, checkinSaved);
      })
    }
  });

}

function getChecinsByUser(userName, callback) {
  userService.getUserByName(userName, function (err, user) {
    if (err) {
      callback(err, null);
    } else {
      Checkin.getCheckinsForUser(user._id, function (err, checkins) {
        if (err) {
          err.applicationErrorCode = 'CHECKINS_NOT_FOUND_FOR_USER'
        } else {
          if (checkins) {
            callback(null, checkins);
          } else {
            var error = new Error();
            error.applicationErrorCode = 'CHECKINS_NOT_FOUND_FOR_USER'
            callback(error, null);
          }
        }
      });
    }
  });
}
function getCheckinsByLocation(locationName, callback) {
  locationService.getLocationByName(locationName, function (err, location) {
    if (err) {
      callback(err, null);
    } else {
      Checkin.getCheckinsForLocation(location._id, function (err, checkins) {
        if (err) {
          err.applicationErrorCode = 'CHECKINS_NOT_FOUND_FOR_LOCATION'
        } else {
          if (checkins) {
            callback(null, checkins);
          } else {
            var error = new Error();
            error.applicationErrorCode = 'CHECKINS_NOT_FOUND_FOR_LOCATION'
            callback(error, null);
          }
        }
      });
    }
  });
}
function getAllCheckins(userName, locationName, callback) {

  if (userName !== null && locationName !== null) {
    findUserAndLocationInParallel(userName, locationName, function (err, results) {
      Checkin.find({
        user: results.user._id,
        location: results.location._id
      }).populate('location').exec(function (err, checkins) {
        callback(err, checkins);
      });
    });
  } else if (userName !== null) {
    getChecinsByUser(userName, callback);
  } else if (locationName !== null) {
    getCheckinsByLocation(locationName, callback);
  } else {
    var error = new Error();
    error.applicationErrorCode = 'MISSING_PARAMETERS';
    callback(error, null);
  }
}