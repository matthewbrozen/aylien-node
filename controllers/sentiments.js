
var AylienNewsApi = require('aylien-news-api');

var apiInstance = new AylienNewsApi.DefaultApi();

require('dotenv').config()

// Configure API key authorization: app_id
var app_id = apiInstance.apiClient.authentications['app_id'];
app_id.apiKey = process.env.ID;

// Configure API key authorization: app_key
var app_key = apiInstance.apiClient.authentications['app_key'];
app_key.apiKey = process.env.KEY;

//sentiment model
var Sentiment = require('../models/sentiment');

//express
var express = require('express');
var app = express();

app.use(allowCors);

//cors header function
function allowCors(req, res, next) {
  res.header('Access-Control-Allow-Origin',  '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  // Handle "preflight" requests.
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
}

//get function
function index(req, res, next) {
  Sentiment.find({}, function(err, sentiments) {
    if (err) throw err;
    res.json({allSentiments: sentiments});
  }).select('-_v');
}

//post function
function callAylien(req, res, next){



  var opts = {
    'title': req.body.company,
    'language': ['en'],
    'publishedAtStart': 'NOW-90DAYS',
    'publishedAtEnd': 'NOW-30DAYS',
    'perPage': '100',
    'sortBy': "published_at",
  };


  var callback = function(error, data, response) {
    if (error) {
      console.error(error);
    } else {

      var b = 0;
      var c = 0;
      var d = 0;
      var e = 0;
      var f = 0;
      var g = 0;
      var h = [];
      var j = [];
      var k = [];
      var l = [];
      var m = [];
      var n = [];
      for (var i = 0; i < data.stories.length; i++){

        if(data.stories[i].sentiment.body.polarity == "positive"){
          b = b + data.stories[i].sentiment.body.score;
          c++;
          h.push(data.stories[i].source.homePageUrl);
          j.push(data.stories[i].title);
        }
        else if(data.stories[i].sentiment.body.polarity == "neutral"){
          d = d + data.stories[i].sentiment.body.score;
          e++;
          k.push(data.stories[i].source.homePageUrl);
          l.push(data.stories[i].title);

        }
        else if(data.stories[i].sentiment.body.polarity == "negative"){
          f = f + data.stories[i].sentiment.body.score;
          g++;
          m.push(data.stories[i].source.homePageUrl);
          n.push(data.stories[i].title);

        }
      }
      var positive = (b/c) * 100;
      var neutral = (d/e) * 100;
      var negative = (f/g) * 100;

      var sentiment = new Sentiment();
        sentiment.company = req.body.company;
        sentiment.count = data.stories.length;
        sentiment.positive_score = positive;
        sentiment.positive_article_title = h;
        sentiment.positive_article_source = j;
        sentiment.neutral_score = neutral;
        sentiment.neutral_article_title = k;
        sentiment.neutral_article_source = l;
        sentiment.negative_score = negative;
        sentiment.negative_article_title = m;
        sentiment.negative_article_source = n;

    sentiment.save(function(err, sentiment) {
      if (err) throw err;
      res.json({newSentiment: sentiment});
    });

    }
  };
  apiInstance.listStories(opts, callback);

}

module.exports = {
  index: index,
  callAylien: callAylien
}
