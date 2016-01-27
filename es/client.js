"use strict";
var elastic = require('elasticsearch');

var client = new elastic.Client({
    log: 'trace',
    //host: 'localhost:9200',
    //host: '192.168.1.121:9200',
    host: '91.210.104.87:9200'
});

module.exports = exports = client;