var mongoose = require('./client');

var schema = mongoose.Schema({
    name: String,
    created: {type: Date, default: Date.now},
    yandex: {
        query: String,
        pages: Number
    },
    google: {
        query: String,
        pages: Number
    }
});

var predicate = function (query) {
    var f = query.filter || {};
    var p = {};
    if (f.name) {
        p.name = new RegExp(f.name, "i")
    }
    if (f.phrase) {
        p['yandex.query'] = new RegExp(f.phrase, "i")
    }
    return p;
};

schema.statics.findByQuery = function (query) {
    return this
        .find(predicate(query))
        .sort(query.sort())
        .skip(query.skip())
        .limit(query.take())
        .exec();
};

schema.statics.countByQuery = function (query) {
    return this
        .count(predicate(query))
        .exec();
};

var model = mongoose.model('Theme', schema, 'themes');

module.exports = model;


