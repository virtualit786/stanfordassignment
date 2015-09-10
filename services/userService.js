/**
 * Created by farooqhameed on 8/14/15.
 */
var User = require('../models/User');

module.exports = {
  getUserByName: getUserByName,
  addNewUser: addNewUser
};

function getUserByName(userName, callback) {

  User.findByName(userName, function (err, user) {
    if (err) {
      err.applicationErrorCode = 'USER_NOT_FOUND';
      callback(err, null);
    } else {
      if (user) {
        callback(null, user);
      } else {
        var error = new Error();
        error.applicationErrorCode = 'USER_NOT_FOUND';
        callback(error, null);
      }
    }
  });
}

function addNewUser(userName, email, first, last, middle, callback) {
  User.save(userName, email, first, last, middle, function (err, user) {
    if (err) {
      err.applicationErrorCode = 'USER_NOT_SAVED';
      callback(err, null);
    } else {
      callback(null, user);
    }
  });
}