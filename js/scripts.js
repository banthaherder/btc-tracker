//Busniness logic
var url = 'https://apiv2.bitcoinaverage.com/indices/global/ticker/BTCUSD';
var currentBtcData;

var getCurrentBtcData = function() {
  // Uses jQuery GET method to retrieve the btc data
  $.getJSON("https://apiv2.bitcoinaverage.com/indices/global/ticker/BTCUSD", function(data) {
    currentBtcData = data;
    $("#btc-price").text(currentBtcData.last);
  })
};
//Portfolio stuff
function Portfolio(name, initialValue) {
  this.name = name;
  this.initialValue = initialValue;
}

//UI Logic
$(document).ready(function() {
//Portfolio stuff
  $("#newPortfolio").submit(function(event) {
    event.preventDefault();
    getCurrentBtcData();
    var newPortfolio = new Portfolio ($("#newPortfolioName").val(), currentBtcData.last);
    $(".portfolioDisplay").append($("#newPortfolioName").val() +  "bought bitcoin at " + newPortfolio.initialValue);
    $("#lossGainButton").last().click(function() {
      getCurrentBtcData();
      $(".comparisonDisplay").append(newPortfolio.name + " loss/gain: "+ (currentBtcData.last - newPortfolio.initialValue).toFixed(4));
    })
  });
  //End Portfolio stuff
  //This will call currentPrice from backend and update it on the page:
  getCurrentBtcData();

  // Refreshes the BTC price data on the page
  $("refresh-data").click(function() {
    getCurrentBtcData();
  });

  $("#converter-link").click(function() {
    getCurrentBtcData();
    $("#home").hide();
    $("#converter").show();

    $("#convert").click(function() {
      var usd = $("#usd").val();
      $("#btc").val((usd/currentBtcData.last).toFixed(8));
    });
    $("#swap").click(function() {
      // Kind of redunant. If anyone has a better way to clear form fields!
      $("#btc").val("");
      $("#btc2").val("");
      $("#usd").val("");
      $("#usd2").val("");

      $("#price-converter").toggle();
      $("#price-converter-swapped").toggle();

      $("#convert").click(function() {
        var btc = $("#btc2").val();
        $("#usd2").val((currentBtcData.last * btc).toFixed(2));
      });
    });
  });
  $("#home-link").click(function() {
    $("#converter").hide();
    $("#home").show();
  });
});
