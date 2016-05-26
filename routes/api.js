var router = require('express').Router();
var post = require('./api/post');
var theme = require('./api/theme');

router.use('/post', post);
router.use('/theme', theme);

module.exports = router;