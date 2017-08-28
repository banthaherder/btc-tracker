//Busniness logic
var url = 'https://apiv2.bitcoinaverage.com/indices/global/ticker/BTCUSD';
var currentBtcData;

var getCurrentBtcData = function() {
  // Uses jQuery GET method to retrieve the btc data
  $.getJSON("https://apiv2.bitcoinaverage.com/indices/global/ticker/BTCUSD", function(data) {
    currentBtcData = data;
    $("#btc-price").text("1 BTC = $" + currentBtcData.last);
  })
};
//Portfolio stuff

var btcPrices = ["fakePrice1", "fakePrice2", "fakePrice3"];

// function displayLastPrice() {
//   for (i = 0; i<btcPrices.length; ++i) {
//     var index = i
//   }
//   return btcPrices[index];
// }

//UI Logic
$(document).ready(function() {
//Portfolio stuff
  $("#portfolioButton").click(function(){
    getCurrentBtcData();
    var initialValue = currentBtcData.last;
    $(".portfolioDisplay").append("Aaron bought bitcoin at " + initialValue);
    $("#lossGainButton").click(function() {
      getCurrentBtcData();

      $(".comparisonDisplay").append("loss/gain: "+ (currentBtcData.last - initialValue).toFixed(4));
    })
  });
  //End Portfolio stuff
  //This will call currentPrice from backend and update it on the page:
  getCurrentBtcData();

  // Refreshes the BTC price data on the page
  $("refresh-data").click(function(){
    getCurrentBtcData();
  });

});
