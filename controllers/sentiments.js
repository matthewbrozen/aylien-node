
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


//show one function
function show(req, res, next) {
  var id = req.params.id;
  Sentiment.findOne({_id: id}, function(err, sentiment) {
    if (err) throw err;
    res.json({selectedSentiment: sentiment});
  });
}

//post function
function callAylien(req, res, next){

app.use(allowCors);

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
      throw error;
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

      var o = [];
      var p = [];
      var q = [];

      for (var i = 0; i < data.stories.length; i++){

        if(data.stories[i].sentiment.body.polarity == "positive"){
          b = b + data.stories[i].sentiment.body.score;
          c++;
          h.push(data.stories[i].source.homePageUrl);
          j.push(data.stories[i].title);
          o.push(data.stories[i].summary.sentences);
        }
        else if(data.stories[i].sentiment.body.polarity == "neutral"){
          d = d + data.stories[i].sentiment.body.score;
          e++;
          k.push(data.stories[i].source.homePageUrl);
          l.push(data.stories[i].title);
          p.push(data.stories[i].summary.sentences);

        }
        else if(data.stories[i].sentiment.body.polarity == "negative"){
          f = f + data.stories[i].sentiment.body.score;
          g++;
          m.push(data.stories[i].source.homePageUrl);
          n.push(data.stories[i].title);
          q.push(data.stories[i].summary.sentences);

        }
      }
      var positive = (b/c) * 100;
      var neutral = (d/e) * 100;
      var negative = (f/g) * 100;

      var sentiment = new Sentiment();
        sentiment.company = req.body.company;
        sentiment.count = data.stories.length;
        sentiment.positive_score = positive;
        sentiment.positive_article_title = j;
        sentiment.positive_article_source = h;
        sentiment.positive_article_summary = o;
        sentiment.neutral_score = neutral;
        sentiment.neutral_article_title = l;
        sentiment.neutral_article_source = k;
        sentiment.neutral_article_summary= p;
        sentiment.negative_score = negative;
        sentiment.negative_article_title = n;
        sentiment.negative_article_source = m;
        sentiment.negative_article_summary = q;

    sentiment.save(function(err, sentiment) {
      if (err) throw err;
      res.json({newSentiment: sentiment});
    });

    }
  };
  apiInstance.listStories(opts, callback);

}


//destroy a report
function destroy(req, res, next) {
  var id = req.params.id;
  console.log(id);
  Sentiment.remove({_id: id}, function(err) {
    if (err) throw err;
    res.json({message: "Senitment successfully deleted"});
  }).select('-_v');
}

module.exports = {
  index: index,
  show: show,
  callAylien: callAylien,
  deleteOne: destroy
}
