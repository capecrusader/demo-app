//import package
var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan')
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');

//create express app
var app = express();


// Configure local DB
mongoose.connect("mongodb://localhost:27017/stocks_demo");

//Defining middleware to serve static files and parse json
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

var Schema = mongoose.Schema;

var yahooModelSchema = new Schema({
  _id :Object,
  query: {
    count: Number,
    created: String,
    lang: String,
    results: {
      quote: {
        DaysLow:Number,
        DaysHigh:Number,
        YearLow:Number,
        YearHigh:Number,
        MarketCaptilization: String,
        LastTradePriceOnly: Number,
        Name:String,
        LastTradeTime:String,
        Volume:Number
      }
    }
  }
}, {collection: 'stock_price'})

var twitterModelSchema = new Schema({
  _id :Object,
  createdAt:String,
  hashtag: String,
  favoriteCount:Number,
  favorited:Boolean,
  id:String,
  retweetCount:Number,
  retweeted:Boolean,
  text:String,
  predictionLabel:String
}, {collection: 'twitterLendingClubPred'})


var yahooModel = mongoose.model('yahooStock', yahooModelSchema)

app.get('/api/stocks', function(req, res) {
  console.log('Before db fetch...')
  yahooModel.find(function(err, stocks) {
    if(err) {
      res.send(err);
    }
    //    console.log('stocks:' + JSON.stringify(stocks))
    res.json(stocks);
  });
});

var twitterModel = mongoose.model('twitterData', twitterModelSchema)

app.get('/api/tweets', function(req, res) {
  console.log(req.query.instant);
  var dateTime = new Date(req.query.instant);
  var dateTimeStr = dateTime.toDateString();

  var id = 728208076038234115

  twitterModel.find({id: {$gte: id}}, function(err, tweets) {
    if(err) {
      res.send(err);
    }
//    console.log('tweets:' + JSON.stringify(tweets))
    id = tweets[0].id;
    console.log(tweets[0].id);
    res.json(tweets);
  });
})

// load the single view file (angular will handle the page changes on the front-end)
app.get('*', function(req, res) {
  //    res.sendfile('./public/index.html');
  res.sendFile('index.html', { root: path.join(__dirname, './public') })
});

//Start the server
app.listen("3301", function(){
  console.log('Server up: http://localhost:3301');
});
