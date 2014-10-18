var http = require("http");

module.exports = {
  get_locations: function(product, zip) {
    http.get("http://api.remix.bestbuy.com/v1/products(name=" + product + "*)?show=name,sku&format=json&apiKey=kpxpjpgkvyke9r8aub9urpna", function(res) {
      var textdata = "";
      res.on("data", function(chunk) {
        textdata += chunk;
      });
      res.on("end", function() {
        var data = JSON.parse(textdata);
        console.log(data.products[0].sku);
      });
    });
    //return ["10028", product]; //return array of arrays of coordinates
  }
};

/*var store = {
	"name": "Best Buy",
	"lat": "gasrgatwertga",
	"long": "garfweafawefae"
};*/
