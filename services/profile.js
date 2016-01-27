"use strict";
var async = require('co').wrap;
var es = require('../es/client');
var mapper = require('./mappers/profile');
var queries = require('./queries');
var settings = require('../config/settings.js');

var findProfilesByIds = async(function* (ids, take) {
    var res = yield es.search({index: settings.WOBOT_INDEX_NAME, type: 'profile', body: queries.profile.byIds(ids, take)});
    var hits = res.hits.hits;
    var items = hits.map(hit => mapper.hitToProfile(hit));
    return items;
});

module.exports.findProfilesByIds = findProfilesByIds;
