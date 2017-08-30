//Busniness logic
var currentBtcData;
var monthlyBtcData;

var getCurrentBtcData = function() {
  // Uses jQuery GET method to retrieve the btc data
  $.getJSON("https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD", function(data) {
    currentBtcData = data;
    $("#btc-price").text(data.USD);
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
  $.getJSON("https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=100&e=CCCAGG", function(data) {
    monthlyBtcData = data["Data"];
    // console.log(data[0].average);
    $.each(data["Data"], function(key, value){
      date = new Date(value.time * 1000);
      times.push(date.toDateString());
      averages.push(value.close);
    });
    // console.log(data[0].time);
    // Add a helper to format timestamp data
    //Chart JS
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: times,
        datasets: [{
          label: 'Bitcoin Price',
          data: averages,
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
      values.push(currentBtcData.USD);

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
          data: values,
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
    var newPortfolio = new Portfolio ($("#newPortfolioName").val(), currentBtcData.USD, currentBtcData.USD);
    $("#comparisonDisplay").append($("#newPortfolioName").val() +  " bought bitcoin at " + newPortfolio.initialValue);
    $("#comparisonDisplay").slideDown();
    $(".portfolioDisplay").hide()
    $("#lossGainButton").last().click(function() {
      getCurrentBtcData();
      newPortfolio.currentValueArray.push(currentBtcData.USD);
      $("#lossGainDisplay").text($("#newPortfolioName").val() +  " bought bitcoin at " + newPortfolio.initialValue + " loss/gain: "+ (currentBtcData.USD - newPortfolio.initialValue).toFixed(4));
      portfolioBtcGraph();
      $("#portfolioChart").show();

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
    $("#converter").show();
    $("#home").hide();
    $("#graph").hide();
    $("#converter-link").addClass("active");
    $("#home-link").removeClass("active");
    $("#graph-link").removeClass("active");

    $("#convert").click(function() {
      var usd = $("#usd").val();
      $("#btc").val((usd/currentBtcData.USD).toFixed(8));
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
        $("#usd2").val((currentBtcData.USD * btc).toFixed(2));
      });
    });
  });
  $("#graph-link").click(function(){
    historicBtcGraph();
    $("#home").hide();
    $("#converter").hide();
    $("#graph").show();
    $("#converter-link").removeClass("active");
    $("#home-link").removeClass("active");
    $("#graph-link").addClass("active");
  });
  $("#home-link").click(function() {
    $("#home").show();
    $("#graph").hide();
    $("#converter").hide();
    $("#converter-link").removeClass("active");
    $("#home-link").addClass("active");
    $("#graph-link").removeClass("active");
  });
// beginning of info paragraph slides
  $("#showAbout").click(function(){
    $(".about").slideToggle(700);
    $(".blockChain").slideUp(500);
    $(".mining").slideUp(500);
  });
  $("#blockChain").click(function(){
    $(".blockChain").slideToggle(700);
    $(".about").slideUp(500);
    $(".mining").slideUp(500);
  });
  $("#mining").click(function(){
    $(".mining").slideToggle(700);
    $(".about").slideUp(500);
    $(".blockChain").slideUp(500);
  });

  $('#map').addClass('scrolloff');

  $('#overlay').on("mouseup", function(){
    $('#map').addClass('scrolloff');
  });

  $('#overlay').on("mousedown", function(){
    $('#map').removeClass('scrolloff');
  });

  $("#map").mouseleave(function (){
    $('#map').addClass('scrolloff');
  });
});
