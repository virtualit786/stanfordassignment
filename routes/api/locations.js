/**
 * Created by farooqhameed on 8/14/15.
 */

var locationsController = require('../../controllers/locationsController');

module.exports = function (router) {
  router.get('/locations', locationsController.getAllLocations);
  router.post('/locations/add', locationsController.addLocation);
};
