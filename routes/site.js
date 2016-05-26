var router = require('express').Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/themes', function(req, res, next) {
    res.render('themes', { title: 'Темы для фокус кроула' });
});

module.exports = router;