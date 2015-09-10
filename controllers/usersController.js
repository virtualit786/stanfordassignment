/**
 * Created by farooqhameed on 8/14/15.
 */

var userService = require('../services/userService');
var messages = require('../static/messages');

module.exports = {
  addUser: addUser
};


function addUser(req, resp, next) {
  var userName = req.params.userName || null;
  var first = req.params.first || null;
  var last = req.params.last || null;
  var middle = req.params.middle || null;
  var email = req.params.email || null;

  userService.addNewUser(userName, email, first, last, middle, function (err, user) {
    if (err) {
      resp.json({error: messages.error[err.applicationErrorCode]});
    } else {
      resp.json(user);
    }
  });

}
