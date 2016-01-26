"use strict";
var striptags = require('striptags');
var highlighter = require('../utils/highlighter');

var hitToPost = function (hit, post, phrase) {
    post = post || {};
    post.id = hit._id;
    post.profile_id = hit._parent;
    //post.highlights = hit.highlight["body.ru"];
    //post.text = striptags(hit.highlight["body.ru"].join('...'), ['hl']);
    var body = hit._source.body;
    var text = striptags(body);
    var highlights = highlighter.highlight(text, phrase);
    post.text = '...' + highlights.join('...') + '...';
    post.score = hit._score;
    post.source = hit._source.source;
    post.href = hit._source.href;
    post.post_date = hit._source.post_date;
    post.engagement = hit._source.engagement;
    return post;
};

module.exports.hitToPost = hitToPost;