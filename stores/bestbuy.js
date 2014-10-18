var http = require("http");

module.exports = {
  get_locations: function(product, zip) {
    http.get("http://api.remix.bestbuy.com/v1/products(name=" + product + "*)+stores?show=name,sku&format=json&apiKey=kpxpjpgkvyke9r8aub9urpna", function(res) {
      var producttextdata = "";
      res.on("data", function(chunk) {
        producttextdata += chunk;
      });
      res.on("end", function() {
        var productdata = JSON.parse(producttextdata);
        for (var i = 0; i < 1; i++) {
          var sku = productdata.products[i].sku;
          console.log(sku);
          http.get("http://api.remix.bestbuy.com/v1/products(sku=" + sku + ")+stores?show=sku,stores&format=json&apiKey=kpxpjpgkvyke9r8aub9urpna", function(res) {
            var storestextdata = "";
            res.on("data", function(chunk) {
              storestextdata += chunk;
            });
            res.on("end", function() {
              var storesdata = JSON.parse(storestextdata);
              for (var i = 0; i < storesdata.products[0].stores.length; i++) {
                console.log(storesdata.products[0].stores.length);
              }
              //console.log(storesdata.products[0].stores);
            });
          });
        }
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
