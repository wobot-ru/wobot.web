"use strict";
var async = require('co').wrap;
var es = require('../es/client');
var mapper = require('./mappers/post');
var aggsService = require('./aggregations');
var queries = require('./queries');
var settings = require('../config/settings.js');

var  findPosts= async(function* (q) {
    var res = yield es.search({ index: settings.es.index, type: 'post', body: queries.post.list(q) });
    var total = res.hits.total;
    var hits = res.hits.hits;
    var items = hits.map(hit => mapper.hitToPost(hit, null));
    return { total: total, items: items };
});

var search__ = async(function* (query) {

    if (!query.filter.phrase)
        return { emptyPhrase: true };

    var posts = yield findPosts(query);

    if (!posts.total)
        return { notFound: true };

    return {
        posts: posts,
        aggs: {
            totalPosts:{
                //byQuery: yield aggsService.totalPosts.byQuery(query),
                byPhrase: yield aggsService.totalPosts.byPhrase(query)
            },
            totalProfiles:{
               // byQuery: yield aggsService.totalProfiles.byQuery(query),
                byPhrase: yield aggsService.totalProfiles.byPhrase(query)
            },
            totalReach:{
                //byQuery: yield aggsService.totalReach.byQuery(query),
                byPhrase: yield aggsService.totalReach.byPhrase(query)
            },
            totalEngagement:{
                //byQuery: yield aggsService.totalEngagement.byQuery(query),
                byPhrase: yield aggsService.totalEngagement.byPhrase(query)
            },
            leaders: yield aggsService.leaders(query),
            cities: yield aggsService.cities(query),
            sources: yield aggsService.sources(query)
        }
    };
});

var search = async(function* (query) {

    if (!query.filter.phrase)
        return { emptyPhrase: true };

    var aggs = yield [
        findPosts(query),
        aggsService.totalPosts.byPhrase(query),
        aggsService.totalProfiles.byPhrase(query),
        aggsService.totalReach.byPhrase(query),
        aggsService.totalEngagement.byPhrase(query),
        aggsService.leaders(query),
        aggsService.cities(query),
        aggsService.sources(query)
    ];

    if (!aggs[0].total)
        return { notFound: true };

    return {
        posts: aggs[0],
        aggs: {
            totalPosts:{
                byPhrase: aggs[1]
            },
            totalProfiles:{
                byPhrase: aggs[2]
            },
            totalReach:{
                byPhrase: aggs[3]
            },
            totalEngagement:{
                byPhrase: aggs[4]
            },
            leaders: aggs[5],
            cities: aggs[6],
            sources: aggs[7],
            test: 'ok'
        }
    };
});

module.exports.search = search;
