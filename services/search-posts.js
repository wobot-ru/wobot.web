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
    var items = hits.map(hit => mapper.hitToPost(hit, null, q.filter.phrase));
    return { total: total, items: items };
});

var search = async(function* (query) {

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

module.exports.search = search;
