"use strict";
var elastic = require('elasticsearch');
var settings = require('../config/settings');

var client = new elastic.Client({
    log: settings.es.log,
    host: settings.es.host
    //host: '192.168.1.121:9200',
    ///host: '91.210.104.87:9200'
});

module.exports = exports = client;