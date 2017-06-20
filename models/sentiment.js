var mongoose = require('mongoose');

var sentimentSchema = mongoose.Schema({
    company: String,
    count: Number,
    positive_score: Number,
    neutral_score: Number,
    negative_score: Number
});

var Sentiment = mongoose.model("Sentiment", sentimentSchema);
module.exports = Sentiment;
