//Busniness logic
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
  //This will evenually call a function in the business logic:
  $("#btc-price").text(displayLastPrice());
});
