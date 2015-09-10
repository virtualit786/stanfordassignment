/**
 * Created by farooqhameed on 8/14/15.
 */
var locationService = require('../services/locationService');
var messages = require('../static/messages');

module.exports = {
  addLocation: addLocation,
  getAllLocations: getAllLocations

};


function addLocation(req, resp, next) {
  var name = req.body.name || null;
  var latitude = req.body.latitude || null;
  var longitude = req.body.longitude || null;
  locationService.addNewLocation(name, latitude, longitude, function (err, location) {
    if (err) {
      resp.json({error: messages.error[err.applicationErrorCode]});
    } else {
      resp.json(location);
    }
  });
}
function getAllLocations(req, resp, next) {
  locationService.getAllLocations(function (err, location) {
    if (err) {
      resp.json({error: messages.error[err.applicationErrorCode]});
    } else {
      resp.json(location);
    }
  });
}