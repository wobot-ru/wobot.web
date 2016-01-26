var router = require('express').Router();
var site = require('./site');
var api = require('./api');

router.use('/', site);
router.use('/api', api);

module.exports = router;
