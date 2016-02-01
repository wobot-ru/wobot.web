"use strict";

var router = require('express').Router();
var moment = require('moment');
var service = require('../../services/post');
var Query = require('../../models/query');

router.get('/search', function (req, res, next) {
    var query = new Query(req.query.q);

    var action = service.search(query);
    action.then(function (data) {
        return res.json(data);
    });
    action.catch(function (err) {
        return next(err)
    });
});

module.exports = router;