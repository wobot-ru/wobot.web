"use strict";
var _ = require('lodash');
var async = require('co').wrap;
var es = require('../es/client');
var queries = require('./queries');
var settings = require('../config/settings');
var moment = require('moment');

var totalPostsByPhrase = async(function* (q) {
    var res = yield es.search({index: settings.es.index, type: 'post', body: queries.aggs.totalPosts.byPhrase(q)});
    return res.hits.total;
});

var totalPostsByQuery = async(function* (q) {
    var res = yield es.search({index: settings.es.index, type: 'post', body: queries.aggs.totalPosts.byQuery(q)});
    return res.hits.total;
});

var totalProfilesByPhrase = async(function* (q) {
    var res = yield es.search({index: settings.es.index, type: 'post', body: queries.aggs.totalProfiles.byPhrase(q)});
    return res.aggregations.profile_count.value;
});

var totalProfilesByQuery = async(function* (q) {
    var res = yield es.search({index: settings.es.index, type: 'post', body: queries.aggs.totalProfiles.byQuery(q)});
    return res.aggregations.profile_count.value;
});

var totalEngagementByPhrase = async(function* (q) {
    var res = yield es.search({index: settings.es.index, type: 'post', body: queries.aggs.totalEngagement.byPhrase(q)});
    return res.aggregations.engagement.value;
});

var totalEngagementByQuery = async(function* (q) {
    var res = yield es.search({index: settings.es.index, type: 'post', body: queries.aggs.totalEngagement.byQuery(q)});
    return res.aggregations.engagement.value;
});

var totalReachByPhrase = async(function* (q) {
    var res = yield es.search({index: settings.es.index, type: 'post', body: queries.aggs.totalReach.byPhrase(q)});
    return res.aggregations.reach.value;
});

var totalReachByQuery = async(function* (q) {
    var res = yield(es.search({index: settings.es.index, type: 'post', body: queries.aggs.totalReach.byQuery(q)}));
    return res.aggregations.reach.value;
});

var leaders = async(function* (q) {
    var res = yield es.search({index: settings.es.index, type: 'post', body: queries.aggs.leaders(q)});
    var buckets = res.aggregations.agg_profile.buckets;
    var profiles = [];
    for (const bucket of buckets) {
        let profile = {};
        let info_hit = bucket.agg_profile_info.hits.hits[0];
        let info = info_hit._source;

        profile.id = info.profile_id;
        profile.source = info.source;
        profile.href = info.profile_href;
        profile.sm_profile_id = info.sm_profile_id;
        profile.name = info.profile_name;
        profile.city = info.profile_city;
        profile.gender = info.profile_gender;
        profile.reach = info.reach;
        profile.relevant_posts = bucket.doc_count;
        profiles.push(profile)
    }
    return profiles;
});

var cities = async(function* (q) {
    var res = yield es.search({index: settings.es.index, type: 'post', body: queries.aggs.cities(q)});
    var total = res.hits.total;
    var buckets = res.aggregations.agg_cities.buckets;
    var cities = [];
    for (const bucket of buckets) {
        let city = {};
        city.id = bucket.key;
        city.name = bucket.key || "(нет данных)";
        city.relevant_posts = bucket.doc_count;
        if (total) {
            city.fraction = city.relevant_posts / total;
        }
        cities.push(city);
    }
    return cities;
});

var postsByCities = async(function* (q) {
    var res = yield es.search({index: settings.es.index, type: 'post', body: queries.aggs.cities(q, 30)});
    var total = res.hits.total;
    var curr = 0;
    var buckets = res.aggregations.agg_cities.buckets;
    var cities = [];
    for (const bucket of buckets) {
        let city = {};
        city.name = bucket.key || "(нет данных)";
        city.y = bucket.doc_count;
        curr += city.y;
        cities.push(city);
    }
    var rest = total - curr;
    cities.push({name: 'Прочие', y: rest});

    return cities;
});



var sources = async(function* (q) {
    var res = yield es.search({index: settings.es.index, type: 'post', body: queries.aggs.sources(q)});
    var buckets = res.aggregations.agg_source.buckets;
    var sources = [];
    for (const bucket of buckets) {
        let source = {};
        source.id = bucket.key;
        source.name = bucket.key || "(нет данных)";
        source.relevant_posts = bucket.doc_count;
        sources.push(source);
    }
    return sources;
});

var lastPostDate = async(function*(q) {
    var res = yield es.search({index: settings.es.index, type: 'post', body: queries.aggs.lastPostDate(q)});
    return res.aggregations.agg_last_date.value;
});

var postTimeSeries= async(function*(q, interval){

    var parseInterval = function(interval){
        if (interval === 'd') return 'day';
        if (interval === 'w') return 'week';
        if (interval === 'm') return 'month';
        return 'day';
    };

    interval = parseInterval(interval);

    var to = yield lastPostDate(q);
    to = to || new Date().getTime();

    q.filter.to = moment(to).endOf('day');
    q.filter.from = moment(q.filter.to).subtract(9, interval + 's').startOf('day');


    var res = yield es.search({index: settings.es.index, type: 'post', body: queries.aggs.postSeries(q, interval)});
    var buckets = res.aggregations.agg_total.buckets;

    return {
        posts: buckets.map(x => [x.key, x.doc_count]),
        profiles: buckets.map(x => [x.key, x.agg_profiles.value]),
        reach: buckets.map(x => [x.key, x.agg_reach.value]),
        engagement: buckets.map(x => [x.key, x.agg_engagement.value])
    }
});




module.exports = {
    totalPosts: {
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
    cities: cities,
    sources: sources,
    postTimeSeries:postTimeSeries,
    postsByCities: postsByCities
};
