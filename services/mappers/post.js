"use strict";
var striptags = require('striptags');

var hitToPost = function (hit, post) {
    post = post || {};
    post.id = hit._id;
    post.profile_id = hit._source.profile_id;
    post.sm_profile_id = hit._source.sm_profile_id;
    post.profile_name = hit._source.profile_name;
    post.profile_href = hit._source.profile_href;
    post.profile_city = hit._source.profile_city || '(нет данных)';
    post.profile_gender = hit._source.profile_gender;
    post.profile_id = hit._source.profile_id;

    /*var body = hit._source.post_body;
    var text = striptags(body);
    var highlights = highlighter.highlight(text, phrase);
    post.text = '...' + highlights.join('...') + '...';*/

    post.text = '...' + striptags(hit.highlight["post_body.ru"].join('...'), ['hl']) + '...';

    post.score = hit._score;
    post.source = hit._source.source;
    post.post_href = hit._source.post_href;
    post.post_date = hit._source.post_date;
    post.engagement = hit._source.engagement;
    post.reach = hit._source.reach;
    post.is_comment = hit._source.is_comment;

    return post;
};

module.exports.hitToPost = hitToPost;