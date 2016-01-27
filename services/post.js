"use strict";
var async = require('co').wrap;
var _ = require('lodash');
var es = require('../es/client');
var mapper = require('./mappers/post');
var profileService = require('./profile');
var aggsService = require('./aggregations');
var queries = require('./queries');
var settings = require('../config/settings.js');


var findPosts = async(function* (q) {
    var res = yield es.search({ index: settings.WOBOT_INDEX_NAME, type: 'post', body: queries.post.search(q) });
    var total = res.hits.total;
    var hits = res.hits.hits;
    var items = hits.map(hit => mapper.hitToPost(hit, null, q.filter.phrase));
    return { total: total, items: items };
});

var fillProfiles = async(function* (posts) {
    var profileIds = _(posts).map(x => x.profile_id).uniq().value();
    var profiles = yield profileService.findProfilesByIds(profileIds, posts.length);
    profiles = _(profiles).keyBy('id').value();
    for (var p of posts) {
        p.profile = profiles[p.profile_id];
    }
});

var search = async(function* (query) {

    if (!query.filter.phrase)
        return { emptyPhrase: true };

    var posts = yield findPosts(query);

    if (!posts.total)
        return { notFound: true };

    yield fillProfiles(posts.items);

    return {
        posts: posts,
        aggs: {
            totalPosts:{
                byPhrase: yield aggsService.totalPosts.byPhrase(query),
                byQuery: yield aggsService.totalPosts.byQuery(query)
            },
            totalProfiles:{
                byPhrase: yield aggsService.totalProfiles.byPhrase(query),
                byQuery: yield aggsService.totalProfiles.byQuery(query)
            },
            totalReach:{
                byPhrase: yield aggsService.totalReach.byPhrase(query),
                byQuery: yield aggsService.totalReach.byQuery(query)
            },
            totalEngagement:{
                byPhrase: yield aggsService.totalEngagement.byPhrase(query),
                byQuery: yield aggsService.totalEngagement.byQuery(query)
            },
            leaders: yield aggsService.leaders(query),
            cities: yield aggsService.cities(query),
            sources: yield aggsService.sources(query)
        }
    };
});

module.exports.search = search;
