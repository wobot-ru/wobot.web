"use strict";
var elastic = require('elasticsearch');
var settings = require('../config/settings');

var client = new elastic.Client({
    log: settings.es.log,
    hosts: settings.es.hosts
    //host: settings.es.host
});

module.exports = exports = client;