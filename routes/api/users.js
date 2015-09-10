/**
 * Created by farooqhameed on 8/14/15.
 */

var usersController = require('../../controllers/usersController');

module.exports = function (router) {
  router.get('/users/add/:userName/:email/:first/:last/:middle', usersController.addUser);
};
