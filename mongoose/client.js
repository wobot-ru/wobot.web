var mongoose = require('mongoose');
var settings = require('../config/settings');
var db = mongoose.connect(settings.mongo.url);

// Use native promises
mongoose.Promise = global.Promise;

module.exports = mongoose;
