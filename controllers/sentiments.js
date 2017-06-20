
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
      for (var i = 0; i < data.stories.length; i++){
        // console.log("Article Source : " + data.stories[i].source.homePageUrl);
        // console.log("Article Name : " + data.stories[i].title);
        // console.log("Article Date : " + data.stories[i].publishedAt);
        // console.log(" Title Polarity is : " + data.stories[i].sentiment.title.polarity + ", and the Polarity Score is : " + data.stories[i].sentiment.title.score );
        // console.log(" Body of Article Polarity is : " + data.stories[i].sentiment.body.polarity + ", and the Polarity Score is : " + data.stories[i].sentiment.body.score);
        if(data.stories[i].sentiment.body.polarity == "positive"){
          b = b + data.stories[i].sentiment.body.score;
          c++;
        }
        else if(data.stories[i].sentiment.body.polarity == "neutral"){
          d = d + data.stories[i].sentiment.body.score;
          e++;

        }
        else if(data.stories[i].sentiment.body.polarity == "negative"){
          f = f + data.stories[i].sentiment.body.score;
          g++;

        }
      }
      var positive = (b/c) * 100;
      var neutral = (d/e) * 100;
      var negative = (f/g) * 100;
      var sentiment = new Sentiment();
        sentiment.company = req.body.company;
        sentiment.count = data.stories.length;
        sentiment.positive_score = positive;
        sentiment.neutral_score = neutral;
        sentiment.negative_score = negative;

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
