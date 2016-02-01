"use strict";
var PostQueryBuilder = require('./post-query-builder')

var postList = function (q) {
    var query = new PostQueryBuilder(q).boostPhrase().build();
    //bug: Highlight not working in elasticsearch 2.1
    // https://github.com/elastic/elasticsearch/issues/14999
    var body = {
        "from": q.skip(),
        "size": q.take(),
        "query": query/*,
         "highlight": {
         "pre_tags": [
         "<hl class='hl'>"
         ],
         "post_tags": [
         "</hl>"
         ],
         "fields": {
         "body.ru": {
         "fragment_size": 350,
         "number_of_fragments": 3
         }
         }
         }*/
    };

    var order = q.order.items[0].column;
    if (order === 'engagement') {
        body.sort = [{'engagement': {'order': 'desc'}}];
    }
    else if (order === 'date') {
        body.sort = [{'post_date': {'order': 'desc'}}];
    }
    else if (order === 'reach') {
        body.query.bool.must.push({
            "has_parent": {
                "parent_type": "profile",
                "score_type": "score",
                "query": {
                    "function_score": {
                        "script_score": {
                            "script": "doc[\"reach\"].value"
                        }
                    }
                }
            }
        })
    }
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

var profilesByIds = function (ids, take) {
    return {"size": take || 20, "query": {"ids": {"values": ids}}};
};

var totalPostsByPhrase = function (q) {
    return {
        "size": 0,
        "query": postByPhrase(q) //queryPosts.postsByPhrase(q)
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
        "query": {
            "has_child": {
                "type": "post",
                "query": postByPhrase(q)
            }
        }
    };
};

var totalProfilesByQuery = function (q) {
    return {
        "size": 0,
        "query": {
            "has_child": {
                "type": "post",
                "query": postByQuery(q)
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
        "query": {
            "has_child": {
                "type": "post",
                "query": postByPhrase(q)
            }
        },
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
        "query": {
            "has_child": {
                "type": "post",
                "query": postByPhrase(q)
            }
        },
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
        "query": {
            "has_child": {
                "type": "post",
                "query": query
            }
        },
        "aggs": {
            "agg_profile": {
                "terms": {
                    //"field": "_uid",
                    "field": "id",
                    "size": 10,
                    "order": {
                        "agg_reach": "desc"
                        //"agg_total_posts>agg_relevant_posts.doc_count": "desc"
                    }
                },
                "aggs": {
                    "agg_profile_info": {
                        "top_hits": {
                            "size": 1
                        }
                    },
                    "agg_reach": {
                        "sum": {
                            "field": "reach"
                        }
                    },
                    "agg_total_posts": {
                        "children": {
                            "type": "post"
                        },
                        "aggs": {
                            "agg_relevant_posts": {
                                "filter": {
                                    "query": query
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

var leaders2 = function (q, take) {
    var query = new PostQueryBuilder(q).ignoreProfiles().build();
    return {
        "size": take,
        "query": {
            "has_child": {
                "type": "post",
                "query": query
            }
        },
        "sort": [
            {
                "reach": {
                    "order": "desc"
                }
            }
        ]
    };
};

var relevantPostForProfiles = function (q, profileIds, take) {
    var query = postByPhrase(q);
    var postFilter = query.bool.filter.query.bool.must;
    postFilter.push({"terms": {"profile_id": profileIds}});
    return {
        "size": 0,
        "query": query,
        "aggs": {
            "agg_profile": {
                "terms": {
                    "field": "profile_id",
                    "size": take
                }
            }
        }
    };
};

var cities = function (q) {
    var query = new PostQueryBuilder(q).ignoreProfiles().ignoreCities().build();
    return {
        "size": 0,
        "query": {
            "has_child": {
                "type": "post",
                "query": query
            }
        },
        "aggs": {
            "agg_cities": {
                "terms": {
                    "field": "city",
                    "size": 10,
                    "order": {
                        "agg_total_posts>agg_relevant_posts.doc_count": "desc"
                    }
                },
                "aggs": {
                    "agg_total_posts": {
                        "children": {
                            "type": "post"
                        },
                        "aggs": {
                            "agg_relevant_posts": {
                                "filter": {
                                    "query": query
                                }
                            }
                        }
                    }
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
        search: postList
    },
    profile: {
        byIds: profilesByIds,
        relevantPostForProfiles: relevantPostForProfiles
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
        leaders2: leaders2,
        cities: cities,
        sources: sources
    }
};
