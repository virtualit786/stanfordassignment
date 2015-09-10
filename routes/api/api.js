/**
 * Created by farooqhameed on 8/14/15.
 */
var express = require('express');
var router = express.Router();

require('./checkins')(router);
require('./users')(router);
require('./locations')(router);

module.exports = router;