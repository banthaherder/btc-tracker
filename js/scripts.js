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


//This will eventually return actual bitcoin prices.
var btcPrices = ["fakePrice1", "fakePrice2", "fakePrice3"];

function displayLastPrice() {
  for (i = 0; i<btcPrices.length; ++i) {
    var index = i
  }
  return btcPrices[index];
}

//UI Logic
$(document).ready(function() {
  //This will call currentPrice from backend and update it on the page:
  getCurrentBtcData();

  // Refreshes the BTC price data on the page
  $("refresh-data").click(function(){
    getCurrentBtcData();
  });

});
