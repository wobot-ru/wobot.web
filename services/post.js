"use strict";
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var _ = require('lodash');
var es = require('../es/client');
var mapper = require('./mappers/post');
var profileService = require('./profile');
var aggsService = require('./aggregations');
var queries = require('./queries');
var settings = require('../config/settings.js');

var findPosts = async(function (q) {
    var res = await(es.search({ index: settings.WOBOT_INDEX_NAME, type: 'post', body: queries.post.search(q) }));
    var total = res.hits.total;
    var hits = res.hits.hits;
    var items = hits.map(hit => mapper.hitToPost(hit, null, q.filter.phrase));
    return { total: total, items: items };
});

var fillProfiles = async(function (posts) {
    var profileIds = _(posts).map(x => x.profile_id).uniq().value();
    var profiles = await(profileService.findProfilesByIds(profileIds, posts.length));
    profiles = _(profiles).keyBy('id').value();
    for (var p of posts) {
        p.profile = profiles[p.profile_id];
    }
});

var search = async(function (query) {

    if (!query.filter.phrase)
        return { emptyPhrase: true };

    var posts = await(findPosts(query));

    if (!posts.total)
        return { notFound: true };

    await(fillProfiles(posts.items));

    return {
        posts: posts,
        aggs: {
            totalPosts:{
                byPhrase: await(aggsService.totalPosts.byPhrase(query)),
                byQuery: await(aggsService.totalPosts.byQuery(query))
            },
            totalProfiles:{
                byPhrase: await(aggsService.totalProfiles.byPhrase(query)),
                byQuery: await(aggsService.totalProfiles.byQuery(query))
            },
            totalReach:{
                byPhrase: await(aggsService.totalReach.byPhrase(query)),
                byQuery: await(aggsService.totalReach.byQuery(query))
            },
            totalEngagement:{
                byPhrase: await(aggsService.totalEngagement.byPhrase(query)),
                byQuery: await(aggsService.totalEngagement.byQuery(query))
            },
            leaders: await(aggsService.leaders(query)),
            cities: await(aggsService.cities(query)),
            sources: await(aggsService.sources(query))
        }
    };
});

module.exports.search = search;
