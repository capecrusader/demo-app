var app=angular.module('stocks_demo',['angularCharts'])
.controller('MainCtrl',function($scope,$http,$interval){
var c=0;
var lastRec = 0;
$interval(function(){
  //Query from DB
  $http.get('/api/stocks')
  .success(function(data) {
    $scope.stocks = data;
  })
  .error(function(data) {
    console.log('Error: ' + data);
  });
  // Populate the object from the
  angular.forEach($scope.stocks, function(value, key) {
    //Only for key greater than last processed, update the collection
    if(key > lastRec) {
      $scope.data.data.push({x:value.query.created, y: [value.query.results.quote.LastTradePriceOnly], tooltip:"("+value.query.results.quote.LastTradeTime + ","+value.query.results.quote.LastTradePriceOnly +")"});
      $scope.tradingName = value.query.results.quote.Name;
      $scope.dailyHigh = value.query.results.quote.DaysHigh;
      $scope.dailyLow = value.query.results.quote.DaysLow;
      $scope.marCap = value.query.results.quote.MarketCapitalization;
      $scope.yearHigh = value.query.results.quote.YearHigh;
      $scope.yearLow = value.query.results.quote.YearLow;
      $scope.totalVolume = value.query.results.quote.Volume;

      lastRec = key;
    }
  });

},2000);

$scope.data = {
  series: ["LClub"],
    data: []
};

$scope.config = {
  title: 'Stock Price Trend',
  tooltips: true,
  labels: false,
  mouseover: function() {},
  mouseout: function() {},
  click: function(data) {
    var instant = {instant : JSON.stringify(data.x)};
    console.log("Clicked!!" + JSON.stringify(instant));
    $http.get('/api/tweets', {params: {"instant" : data.x}})
    .success(function(data) {
      console.log(data);
      $scope.tweets = JSON.stringify(data);
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });
    },
  legend: {
    display: true,
    //could be 'left, right'
    position: "left"
  },
  colors: ["66CCFF"],
  lineCurveType: "monotone", // change this as per d3 guidelines to avoid smoothline
  isAnimate: true, // run animations while rendering chart
  yAxisTickFormat: "s", //refer tickFormats in d3 to edit this value
  xAxisMaxTicks: 1, // Optional: maximum number of X axis ticks to show if data points exceed this number
  yAxisTickFormat: "7", // refer tickFormats in d3 to edit this value
  waitForHeightAndWidth: false // if true, it will not throw an error when the height or width are not defined (e.g. while creating a modal form), and it will be keep watching for valid height and width values

};

});
