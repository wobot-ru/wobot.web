"use strict";
var _ = require('lodash');
var async = require('co').wrap;
var es = require('../es/client');
var queries = require('./queries');
var settings = require('../config/settings');

var totalPostsByPhrase = async(function* (q) {
    var res = yield es.search({index: settings.WOBOT_INDEX_NAME, type: 'post', body: queries.aggs.totalPosts.byPhrase(q)});
    return res.hits.total;
});

var totalPostsByQuery = async(function* (q) {
    var res = yield es.search({index: settings.WOBOT_INDEX_NAME, type: 'post', body: queries.aggs.totalPosts.byQuery(q)});
    return res.hits.total;
});

var totalProfilesByPhrase = async(function* (q) {
    var res = yield es.search({index: settings.WOBOT_INDEX_NAME, type: 'profile', body: queries.aggs.totalProfiles.byPhrase(q)});
    return res.hits.total;
});

var totalProfilesByQuery = async(function* (q) {
    var res = yield es.search({index: settings.WOBOT_INDEX_NAME, type: 'profile', body: queries.aggs.totalProfiles.byQuery(q)});
    return res.hits.total;
});

var totalEngagementByPhrase = async(function* (q) {
    var res = yield es.search({index: settings.WOBOT_INDEX_NAME, type: 'post', body: queries.aggs.totalEngagement.byPhrase(q)});
    return res.aggregations.engagement.value;
});

var totalEngagementByQuery = async(function* (q) {
    var res = yield es.search({index: settings.WOBOT_INDEX_NAME, type: 'post', body: queries.aggs.totalEngagement.byQuery(q)});
    return res.aggregations.engagement.value;
});

var totalReachByPhrase = async(function* (q) {
    var res = yield es.search({index: settings.WOBOT_INDEX_NAME, type: 'profile', body: queries.aggs.totalReach.byPhrase(q)});
    return res.aggregations.reach.value;
});

var totalReachByQuery = async(function* (q) {
    var res = yield(es.search({index: settings.WOBOT_INDEX_NAME, type: 'profile', body: queries.aggs.totalReach.byQuery(q)}));
    return res.aggregations.reach.value;
});

var leaders = async(function* (q){
    var res = yield es.search({index: settings.WOBOT_INDEX_NAME, type: 'profile', body: queries.aggs.leaders(q)});
    var buckets = res.aggregations.agg_profile.buckets;
    var profiles = [];
    for (const bucket of buckets){
        let profile = {};
        let info_hit = bucket.agg_profile_info.hits.hits[0];
        let info = info_hit._source;
        profile.id = info_hit._id;
        profile.source = info.source;
        profile.href = info.href;
        profile.sm_profile_id = info.sm_profile_id;
        profile.name = info.name;
        profile.city = info.city;
        profile.gender = info.gender;
        profile.reach = info.reach;
        profile.relevant_posts = bucket.agg_total_posts.agg_relevant_posts.doc_count;
        profiles.push(profile)
    }
    return profiles;
});

var leaders2 = async(function* (q){
    var take = 10;
    var profileRes = yield es.search({index: settings.WOBOT_INDEX_NAME, type: 'profile', body: queries.aggs.leaders2(q, take)});
    var profileHits = profileRes.hits.hits;
    var profiles = [];
    for (const hit of profileHits){
        let profile = {};
        let info = hit._source;
        profile.id = hit._id;
        profile.source = info.source;
        profile.href = info.href;
        profile.sm_profile_id = info.sm_profile_id;
        profile.name = info.name;
        profile.city = info.city;
        profile.gender = info.gender;
        profile.reach = info.reach;
        profiles.push(profile)
    }

    var leaderIds = profiles.map(x => x.id);
    var postsRes = yield es.search({index: settings.WOBOT_INDEX_NAME, type: 'post', body: queries.profile.relevantPostForProfiles(q, leaderIds, take)});
    var profileBuckets = _.keyBy(postsRes.aggregations.agg_profile.buckets, 'key');

    for (const profile of profiles){
        if (profileBuckets.hasOwnProperty(profile.id)){
            profile.relevant_posts = profileBuckets[profile.id].doc_count;
        }
        else {
            profile.relevant_posts = 0;
        }
    }
    return profiles;
});

var cities = async(function* (q){
    var posts = yield totalPostsByPhrase(q);
    var res = yield es.search({index: settings.WOBOT_INDEX_NAME, type: 'profile', body: queries.aggs.cities(q)});
    var buckets = res.aggregations.agg_cities.buckets;
    var cities = [];
    for (const bucket of buckets){
        let city = {};
        city.id = bucket.key;
        city.name = bucket.key || "(нет данных)";
        city.profiles = bucket.doc_count;
        city.relevant_posts = bucket.agg_total_posts.agg_relevant_posts.doc_count;
        if (posts){
            city.fraction = city.relevant_posts / posts;
        }
        cities.push(city);
    }
    return cities;
});

var sources = async(function* (q){
    var res = yield es.search({index: settings.WOBOT_INDEX_NAME, type: 'post', body: queries.aggs.sources(q)});
    var buckets = res.aggregations.agg_source.buckets;
    var sources = [];
    for (const bucket of buckets){
        let source = {};
        source.id = bucket.key;
        source.name = bucket.key || "(нет данных)";
        source.relevant_posts = bucket.doc_count;
        sources.push(source);
    }
    return sources;
});

module.exports = {
    totalPosts:{
        byQuery: totalPostsByQuery,
        byPhrase: totalPostsByPhrase
    },
    totalProfiles: {
        byQuery: totalProfilesByQuery,
        byPhrase: totalProfilesByPhrase
    },
    totalReach: {
        byQuery: totalReachByQuery,
        byPhrase: totalReachByPhrase
    },
    totalEngagement: {
        byQuery: totalEngagementByQuery,
        byPhrase: totalEngagementByPhrase
    },
    leaders: leaders,
    leaders2: leaders2,
    cities: cities,
    sources: sources
};
