var mongoose = require('mongoose');

var sentimentSchema = mongoose.Schema({
    company: String,
    count: Number,
    positive_score: Number,
    positive_article_title: Array,
    positive_article_source: Array,
    positive_article_summary: Array,
    neutral_score: Number,
    neutral_article_title: Array,
    neutral_article_source: Array,
    neutral_article_summary: Array,
    negative_score: Number,
    negative_article_title: Array,
    negative_article_source: Array,
    negative_article_summary: Array
});

var Sentiment = mongoose.model("Sentiment", sentimentSchema);
module.exports = Sentiment;
