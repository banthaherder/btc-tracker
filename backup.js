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
