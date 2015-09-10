/**
 * Created by farooqhameed on 8/14/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Location = new Schema({
  name: {type: String, required: true, unique: true},
  latitude: {type: String, required: true},
  longitude: {type: String, required: true}
});


Location.statics.save = function (name, latitude, longitude, callback) {
  var location = new this({
    name: name,
    latitude: latitude,
    longitude: longitude
  });
  location.save(function (err, locationSaved) {
    callback(err, locationSaved);
  });
};

Location.statics.findByName = function (name, callback) {
  this.findOne({'name': name}, function (err, location) {
    callback(err, location);
  });
};

module.exports = mongoose.model('Location', Location);