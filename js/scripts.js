//Busniness logic
var url = 'https://apiv2.bitcoinaverage.com/indices/global/ticker/BTCUSD';
var currentBtcData;
var monthlyBtcData;

var getCurrentBtcData = function() {
  // Uses jQuery GET method to retrieve the btc data
  $.getJSON("https://apiv2.bitcoinaverage.com/indices/global/ticker/BTCUSD", function(data) {
    currentBtcData = data;
    $("#btc-price").text(currentBtcData.last);
  })
};
var getMonthlyBtcData = function() {
  // Uses jQuery GET method to retrieve the btc data
  $.getJSON("https://apiv2.bitcoinaverage.com/indices/global/history/BTCUSD?period=daily&?format=json", function(data) {
    monthlyBtcData = data;
  })
};

var historicBtcGraph = function() {
  var times = [];
  var averages = [];
  $.getJSON("https://apiv2.bitcoinaverage.com/indices/global/history/BTCUSD?period=monthly&?format=json", function(data) {
    monthlyBtcData = data;
    // console.log(data[0].average);
    $.each(data, function(key, value){
      times.push(value.time);
      averages.push(value.average);
    });
    // console.log(data[0].time);
    // Add a helper to format timestamp data
    //Chart JS
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: times.reverse(),
        datasets: [{
          label: 'Bitcoin Price',
          data: averages.reverse(),
          backgroundColor: [
          '#263238'
        ],
        borderColor: [
          'rgba(255,99,132,1)'
        ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    });
  });
};
var values = [];
var times = [];
var portfolioBtcGraph = function() {
  var date = Date.now();
      times.push(date);
      values.push(currentBtcData.last);

    // console.log(data[0].time);
    // Add a helper to format timestamp data
    //Chart JS
    var ctx = document.getElementById("portfolioChart").getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: times,
        datasets: [{
          label: 'Bitcoin Price',
          data: values.reverse(),
          backgroundColor: [
          '#263238'
        ],
        borderColor: [
          'rgba(255,99,132,1)'
        ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:false
            }
          }]
        }
      }
    });
    };


//Portfolio stuff
function Portfolio(name, initialValue, currentValue) {
  this.name = name;
  this.initialValue = initialValue;
  this.currentValueArray = [];
}
Portfolio.prototype.array = function(currentValue) {
  this.currentValueArray.push(currentValue)
}

//UI Logic
$(document).ready(function() {
//Portfolio stuff
  $("#newPortfolio").submit(function(event) {
    event.preventDefault();
    getCurrentBtcData();
    var newPortfolio = new Portfolio ($("#newPortfolioName").val(), currentBtcData.last, currentBtcData.last);
    $("#portfolioName").append($("#newPortfolioName").val() +  " bought bitcoin at " + newPortfolio.initialValue);
    $("#comparisonDisplay").show();
    $("#portfolioChart").show();
    $("#lossGainButton").last().click(function() {
      getCurrentBtcData();
      newPortfolio.currentValueArray.push(currentBtcData.last);
      $("#lossGain").text(newPortfolio.name + " loss/gain: "+ (currentBtcData.last - newPortfolio.initialValue).toFixed(4));
      portfolioBtcGraph();
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
    $("#graph").hide();
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
  $("#graph-link").click(function(){
    historicBtcGraph();
    $("#converter").hide();
    $("#home").hide();
    $("#graph").show();
  });
  $("#home-link").click(function() {
    $("#graph").hide();
    $("#converter").hide();
    $("#home").show();
  });

});
