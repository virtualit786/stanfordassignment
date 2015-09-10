/**
 * Created by farooqhameed on 8/14/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  userName: {type: String, required: true, unique: true},
  name: {
    first: {type: String, required: true},
    last: {type: String, required: true},
    middle: {type: String, required: false}
  },
  email: {type: String, required: true, unique: true}
});


User.statics.save = function (userName, email, first, last, middle, callback) {
  var user = new this({
    userName: userName,
    email: email,
    name: {
      first: first,
      last: last,
      middle: middle
    }
  });
  user.save(function (err, userSaved) {
    callback(err, userSaved);
  });
};

User.statics.findByName = function (userName, callback) {
  this.findOne({'userName': userName}, function (err, user) {
    callback(err, user);
  });
};

module.exports = mongoose.model('User', User);