/**
 * Created by farooqhameed on 8/14/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Checkin = new Schema({
  user: {type: ObjectId, required: true, ref: 'User'},
  location: {type: ObjectId, required: true, ref: 'Location'},
  createdAt: {type: Date, default: Date.now()},
});

Checkin.statics.save = function (userId, locationId, callback) {
  var checkin = new this({
    user: userId,
    location: locationId
  });
  checkin.save(function (err, checkinSaved) {
    callback(err, checkinSaved);
  });
};

Checkin.statics.getCheckinsForUser = function (userId, callback) {
  this.find({user: userId}).sort('createdAt').populate('user', 'name.first').populate('location').exec(function (err, checkins) {
    callback(err, checkins);
  });
};

Checkin.statics.getCheckinsForLocation = function (locationId, callback) {
  this.find({location: locationId}).sort('createdAt').populate('user', 'name.first').populate('location').exec(function (err, checkins) {
    callback(err, checkins);
  });
};

module.exports = mongoose.model('Checkin', Checkin);