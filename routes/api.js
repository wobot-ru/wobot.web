var router = require('express').Router();
var post = require('./api/post');

router.use('/post', post);

module.exports = router;