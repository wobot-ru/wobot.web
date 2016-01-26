"use strict";
var elastic = require('elasticsearch');

var client = new elastic.Client({
    host: 'localhost:9200',
    //host: '192.168.1.121:9200',
    log: 'trace'
});

module.exports = exports = client;