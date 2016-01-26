"use strict";
var _ = require('lodash');

var template = function (q) {
    return {
        "bool": {
            "must": [{
                "match": {
                    "body.ru": q.filter.phrase
                }
            }],
            "filter": {
                "query": {
                    "bool": {
                        "must": [
                            {
                                "has_parent": {
                                    "parent_type": "profile",
                                    "query": {
                                        "bool": {
                                            "must": []
                                        }
                                    }
                                }
                            }
                        ]
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
};

Builder.prototype.boostPhrase = function(){
    this._boostPhrase = true;
    return this;
};

Builder.prototype.ignoreSources = function(){
    this._ignoreSources = true;
    return this;
};

Builder.prototype.ignoreCities = function(){
    this._ignoreCities = true;
    return this;
};

Builder.prototype.ignoreProfiles = function(){
    this._ignoreProfiles = true;
    return this;
};

Builder.prototype.build = function () {
    var q = this.q;

    if (!(q.filter && q.filter.phrase)) {
        throw new Error("Search phrase must be specified");
    }

    var query = template(q);
    var postFilter = query.bool.filter.query.bool.must;
    var profileFilter = postFilter[0].has_parent.query.bool.must;

    if (this._boostPhrase) {
        query.bool.should = {"match_phrase": {"body.ru": q.filter.phrase}};
    }

    var sources = q.filter.sources;
    if (!this._ignoreSources && Array.isArray(sources) && sources.length) {
        postFilter.push({"terms": {"source": sources}});
    }

    var cities = q.filter.cities;
    if (!this._ignoreCities && Array.isArray(cities) && cities.length) {
        profileFilter.push({"terms": {"city": cities}});
    }

    var profiles = q.filter.profiles;
    if (!this._ignoreProfiles && Array.isArray(profiles) && profiles.length) {
        profileFilter.push({"ids": {"values": profiles}});
    }

    return query;
};

module.exports = Builder;
