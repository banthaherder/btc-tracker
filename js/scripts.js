//Busniness logic
var currentBtcData;
var currentEthData;
var currentLtcData;

var getCurrentBtcData = function() {
  // Uses jQuery GET method to retrieve the btc data
  $.getJSON("https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD", function(data) {
    currentBtcData = data;
    $("#btc-price").text("1 BTC = $" + data.USD);
  })
};
var getCurrentEthData = function() {
  // Uses jQuery GET method to retrieve the btc data
  $.getJSON("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD", function(data) {
    currentEthData = data;
    $("#eth-price").text("1 ETH = $" + data.USD);
  })
};
var getCurrentLtcData = function() {
  // Uses jQuery GET method to retrieve the btc data
  $.getJSON("https://min-api.cryptocompare.com/data/price?fsym=LTC&tsyms=USD", function(data) {
    currentLtcData = data;
    $("#ltc-price").text("1 LTC = $" + data.USD);
  })
};

var historicBtcGraph = function() {
  var times = [];
  var averages = [];
  $.getJSON("https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=100&e=CCCAGG", function(data) {
    monthlyBtcData = data["Data"];
    $.each(data["Data"], function(key, value){
      date = new Date(value.time * 1000);
      times.push(date.toDateString());
      averages.push(value.close);
    });
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
          '#FFC107'
        ],
          borderWidth: 1.75
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
  var date = new Date;
      times.push(date.toLocaleTimeString());
      values.push(currentBtcData.USD);

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
        '#FFC107'
      ],
        borderWidth: 1.75
      }]
    },
    options: {
      scales: {
        yAxes: [{
          display: true,
          ticks: {
              beginAtZero: false,
              stepSize: 1,
              max: Math.floor(currentBtcData.USD + 5),
              min: Math.floor(currentBtcData.USD - 5),
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

function setIntervalAndExecute(fn, t) {
    fn();
    return(setInterval(fn, t));
}

//UI Logic
$(document).ready(function() {
//Portfolio stuff
  $("#newPortfolio").submit(function(event) {
    event.preventDefault();
    getCurrentBtcData();
    var newPortfolio = new Portfolio ($("#newPortfolioName").val(), currentBtcData.USD, currentBtcData.USD);
    $("#comparisonDisplay").slideDown();
    $(".portfolioDisplay").hide()
      setIntervalAndExecute(function() {
      getCurrentBtcData();
      newPortfolio.currentValueArray.push(currentBtcData.USD);
      $("#lossGainDisplay").text($("#newPortfolioName").val() +  " bought bitcoin at " + newPortfolio.initialValue.toFixed(2) + " loss/gain: "+ (currentBtcData.USD - newPortfolio.initialValue).toFixed(2));
      portfolioBtcGraph();
      $("#portfolioChart").show();
      var count = 10;
      var counter = setInterval(timer, 1000);
      function timer() {
        count = count-1;
        if (count <= 0) {
          clearInterval(counter);
          timer = setInterval(counter, 1000);
        }
        document.getElementById("timer").innerHTML = count + " seconds until bitcoin analysis";
      }
    }, 10000);
  });
  //End Portfolio stuff
  //This will call currentPrice from backend and update it on the page:
  getCurrentBtcData();
  getCurrentEthData();
  getCurrentLtcData();

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
    // ETH Converter ----------------
    $("#convert2").click(function() {
      var usd = $("#usd3").val();
      $("#eth").val((usd/currentEthData.USD).toFixed(8));
    });
    $("#swap2").click(function() {
      $("#eth").val("");
      $("#eth2").val("");
      $("#usd3").val("");
      $("#usd4").val("");

      $("#price-converter2").toggle();
      $("#price-converter-swapped2").toggle();

      $("#convert2").click(function() {
        var eth = $("#eth2").val();
        $("#usd4").val((currentEthData.USD * eth).toFixed(2));
      });
    });
    // LTC Converter ----------------
    $("#convert3").click(function() {
      var usd = $("#usd5").val();
      $("#ltc").val((usd/currentLtcData.USD).toFixed(8));
    });
    $("#swap3").click(function() {
      $("#ltc").val("");
      $("#ltc2").val("");
      $("#usd5").val("");
      $("#usd6").val("");

      $("#price-converter3").toggle();
      $("#price-converter-swapped3").toggle();

      $("#convert3").click(function() {
        var ltc = $("#ltc2").val();
        $("#usd6").val((currentLtcData.USD * ltc).toFixed(2));
      });
    });
  });
  $("#btc-ticker").click(function() {
    $("#eth-ticker").removeClass("active-reverse");
    $("#ltc-ticker").removeClass("active-reverse");
    $("#btc-ticker").addClass("active-reverse");
    $("#eth-price").hide();
    $("#ltc-price").hide();
    $("#btc-price").show();
  });
  $("#eth-ticker").click(function() {
    $("#btc-ticker").removeClass("active-reverse");
    $("#ltc-ticker").removeClass("active-reverse");
    $("#eth-ticker").addClass("active-reverse");
    $("#btc-price").hide();
    $("#ltc-price").hide();
    $("#eth-price").show();
  });
  $("#ltc-ticker").click(function() {
    $("#btc-ticker").removeClass("active-reverse");
    $("#eth-ticker").removeClass("active-reverse");
    $("#ltc-ticker").addClass("active-reverse");
    $("#btc-price").hide();
    $("#eth-price").hide();
    $("#ltc-price").show();
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

  $('#map').addClass('stopScroll');

  $('#overlay').on("mouseup", function(){
    $('#map').addClass('stopScroll');
  });

  $('#overlay').on("mousedown", function(){
    $('#map').removeClass('stopScroll');
  });

  $("#map").mouseleave(function (){
    $('#map').addClass('stopScroll');
  });
});
