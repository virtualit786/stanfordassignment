/**
 * Created by farooqhameed on 8/14/15.
 */

var checkinService = require('../services/checkinsService');
var messages = require('../static/messages');

/*
* Contrary to populat approach where module.exports is defined at bottom, defining it at top of the file allows me to
* clearly inform the interface of the module.
* */

module.exports = {
  checkinUser: checkinUser,
  fetchAllUserCheckins: fetchAllUserCheckins
};

function checkinUser(req, resp, next) {
  var userName = req.params.userName || null;
  var locationName = req.params.locationName || null;

  if (userName === null && locationName === null) {
    resp.status(500).json({error: messages.error['MISSING_PARAMETERS']});
  } else {
    checkinService.checkin(userName, locationName, function (err, checkin) {
      if (err) {
        resp.json({error: messages.error[err.applicationErrorCode]});
      } else {
        resp.json(checkin);
      }
    });
  }
}

function fetchAllUserCheckins(req, resp, next) {
  var userName = req.query.userName || null;
  var locationName = req.query.locationName || null;

  if (userName === null && locationName === null) {
    resp.status(500).json({error: messages.error['MISSING_PARAMETERS']});
  } else {
    checkinService.getAllCheckins(userName, locationName, function (err, checkins) {
      if (err) {
        resp.json({error: messages.error[err.applicationErrorCode]});
      } else {
        var result = {
          count: checkins.length,
          items: checkins
        };
        resp.json(result);

      }
    });
  }
}