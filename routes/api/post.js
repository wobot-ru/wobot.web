"use strict";

var router = require('express').Router();
var moment = require('moment');
var postService = require('../../services/search-posts');
var aggService = require('../../services/aggregations');
var Query = require('../../models/query');

router.get('/search', function (req, res, next) {
    var query = new Query(req.query.q);
    var action = postService.search(query);
    action.then(function (data) {
        return res.json(data);
    });
    action.catch(function (err) {
        return next(err)
    });
});

router.get('/time-series', function (req, res, next) {
    var query = new Query(req.query.q);
    var interval = req.query.interval;
    var action = aggService.postTimeSeries(query, interval);
    action.then(function (data) {
        return res.json(data);
    });
    action.catch(function (err) {
        return next(err)
    });
});

module.exports = router;