"use strict";
var PostQueryBuilder = require('./post-query-builder')

var postList = function (q) {
    var query = new PostQueryBuilder(q).boostPhrase().build();
    //bug: Highlight not working in elasticsearch 2.1
    //(with has_parent query)
    // https://github.com/elastic/elasticsearch/issues/14999
    var body = {
        "from": q.skip(),
        "size": q.take(),
        "query": query,
        "highlight": {
            "pre_tags": [
                "<hl class='hl'>"
            ],
            "post_tags": [
                "</hl>"
            ],
            "fields": {
                "post_body.ru": {
                    "fragment_size": 300,
                    "number_of_fragments": 3
                }
            }
        }
    };

    var order_column = q.order.items[0].column;
    var sort = {};
    sort[order_column] = {'order': 'desc'};
    body.sort = [sort];
    return body;
};

var postByPhrase = function (q) {
    return new PostQueryBuilder(q)
        .ignoreSources()
        .ignoreCities()
        .ignoreProfiles()
        .build();
};

var postByQuery = function (q) {
    return new PostQueryBuilder(q)
        .build();
};

var totalPostsByPhrase = function (q) {
    return {
        "size": 0,
        "query": postByPhrase(q)
    };
};

var totalPostsByQuery = function (q) {
    return {
        "size": 0,
        "query": postByQuery(q)
    };
};

var totalProfilesByPhrase = function (q) {
    return {
        "size": 0,
        "query": postByPhrase(q),
        "aggs": {
            "profile_count": {
                "cardinality": {
                    "field": "profile_id"
                }
            }
        }
    };
};

var totalProfilesByQuery = function (q) {
    return {
        "size": 0,
        "query": postByQuery(q),
        "aggs": {
            "profile_count": {
                "cardinality": {
                    "field": "profile_id"
                }
            }
        }
    };
};

var totalEngagementByPhrase = function (q) {
    return {
        "size": 0,
        "query": postByPhrase(q),
        "aggs": {
            "engagement": {
                "sum": {
                    "field": "engagement"
                }
            }
        }
    };
};

var totalEngagementByQuery = function (q) {
    return {
        "size": 0,
        "query": postByQuery(q),
        "aggs": {
            "engagement": {
                "sum": {
                    "field": "engagement"
                }
            }
        }
    };
};

var totalReachByPhrase = function (q) {
    return {
        "size": 0,
        "query": postByPhrase(q),
        "aggs": {
            "reach": {
                "sum": {
                    "field": "reach"
                }
            }
        }
    };
};

var totalReachByQuery = function (q) {
    return {
        "size": 0,
        "query": postByQuery(q),
        "aggs": {
            "reach": {
                "sum": {
                    "field": "reach"
                }
            }
        }
    };
};

var leaders = function (q) {
    var query = new PostQueryBuilder(q).ignoreProfiles().build();
    return {
        "size": 0,
        "query": query,
        "aggs": {
            "agg_profile": {
                "terms": {
                    "field": "reach",
                    "size": 10,
                    "order": {
                        "_term": "desc"
                    }
                },
                "aggs": {
                    "agg_profile_info": {
                        "top_hits": {
                            "size": 1
                        }
                    }
                }
            }
        }
    }
};

var cities = function (q) {
    var query = new PostQueryBuilder(q).ignoreProfiles().ignoreCities().build();
    return {
        "size": 0,
        "query": query,
        "aggs": {
            "agg_cities": {
                "terms": {
                    "field": "profile_city",
                    "size": 10
                }
            }
        }
    }
};

var sources = function (q) {
    var query = new PostQueryBuilder(q).ignoreProfiles().ignoreSources().build();
    return {
        "size": 0,
        "query": query,
        "aggs": {
            "agg_source": {
                "terms": {
                    "field": "source"
                }
            }
        }
    };
};


module.exports = {
    post: {
        list: postList
    },
    aggs: {
        totalPosts: {
            byPhrase: totalPostsByPhrase,
            byQuery: totalPostsByQuery
        },
        totalProfiles: {
            byPhrase: totalProfilesByPhrase,
            byQuery: totalProfilesByQuery
        },
        totalReach: {
            byPhrase: totalReachByPhrase,
            byQuery: totalReachByQuery
        },
        totalEngagement: {
            byPhrase: totalEngagementByPhrase,
            byQuery: totalEngagementByQuery
        },
        leaders: leaders,
        cities: cities,
        sources: sources
    }
};
