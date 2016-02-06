"use strict";
var _ = require('lodash');
var moment = require('moment');

var template = function (q) {
    return {
        "bool": {
            "must": [{
                "match": {
                    "post_body.ru": q.filter.phrase
                }
            }],
            "filter": {
                "query": {
                    "bool": {
                        "must": []
                    }
                }
            }
        }
    }
};

var Builder = function (q) {
    if (!(this instanceof Builder)) {
        return new Builder(q);
    }
    this.q = q;
    this._boostPhrase = false;
    this._ignoreSources = false;
    this._ignoreCities = false;
    this._ignoreProfiles = false;
    this._ignoreDates = false;
};

Builder.prototype.boostPhrase = function () {
    this._boostPhrase = true;
    return this;
};

Builder.prototype.ignoreSources = function () {
    this._ignoreSources = true;
    return this;
};

Builder.prototype.ignoreCities = function () {
    this._ignoreCities = true;
    return this;
};

Builder.prototype.ignoreDates = function () {
    this._ignoreDates = true;
    return this;
};

Builder.prototype.ignoreProfiles = function () {
    this._ignoreProfiles = true;
    return this;
};

Builder.prototype.build = function () {
    var q = this.q;

    if (!(q.filter && q.filter.phrase)) {
        throw new Error("Search phrase must be specified");
    }

    var query = template(q);
    var filter = query.bool.filter.query.bool.must;

    if (this._boostPhrase) {
        query.bool.should = {"match_phrase": {"post_body.ru": q.filter.phrase}};
    }

    var sources = q.filter.sources;
    if (!this._ignoreSources && Array.isArray(sources) && sources.length) {
        filter.push({"terms": {"source": sources}});
    }

    var cities = q.filter.cities;
    if (!this._ignoreCities && Array.isArray(cities) && cities.length) {
        filter.push({"terms": {"profile_city": cities}});
    }

    var profiles = q.filter.profiles;
    if (!this._ignoreProfiles && Array.isArray(profiles) && profiles.length) {
        filter.push({"terms": {"profile_id": profiles}});
    }

    if (!this._ignoreDates) {
        var dateFilter;
        if (q.filter.from) {
            let m = moment(q.filter.from, ['YYYY-MM-DDTHH:mm:ssZ', 'DD.MM.YYYY']);
            if (m.isValid()) {
                dateFilter = dateFilter || {"range": {"post_date": {}}};
                dateFilter.range.post_date.gte = m.startOf('day').utc().toDate();
            }
        }

        if (q.filter.to) {
            let m = moment(q.filter.to, ['YYYY-MM-DDTHH:mm:ssZ', 'DD.MM.YYYY']);
            if (m.isValid()) {
                dateFilter = dateFilter || {"range": {"post_date": {}}};
                dateFilter.range.post_date.lte = m.endOf('day').utc().toDate();
            }
        }

        if (dateFilter) {
            filter.push(dateFilter);
        }
    }

    return query;
};

module.exports = Builder;
