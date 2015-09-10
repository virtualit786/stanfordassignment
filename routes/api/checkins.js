/**
 * Created by farooqhameed on 8/14/15.
 */

var checkinController = require('../../controllers/checkinController');

module.exports = function (router) {
  router.get('/checkins/add/:userName/:locationName', checkinController.checkinUser);
  router.get('/checkins/list', checkinController.fetchAllUserCheckins);
};
