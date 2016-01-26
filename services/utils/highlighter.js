"use strict";

var fs = require("fs");
var java = require("java");
var baseDir = "./java/lib";
var dependencies = fs.readdirSync(baseDir);

dependencies.forEach(function(dependency){
    java.classpath.push(baseDir + "/" + dependency);
});

module.exports.highlight = function(text, term){
    var highlighter = java.newInstanceSync("com.wobot.lucene.LuceneHighlighter");
    return highlighter.HighlightSync(text, term, 300, 3, "<hl class='hl'>", "</hl>");
};
