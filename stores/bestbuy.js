var app = require("../app.js");
var http = require("http");

module.exports = {
  get_locations: function(product, zip) {
    http.get("http://api.remix.bestbuy.com/v1/products(name=" + product + "*)+stores?show=name,sku&format=json&apiKey=kpxpjpgkvyke9r8aub9urpna", function(res) {
      var nametextdata = "";
      res.on("data", function(chunk) {
        nametextdata += chunk;
      });
      res.on("end", function() {
        var namedata = JSON.parse(nametextdata);
        for (var i = 0; i < 1; i++) {
          var sku = namedata.products[i].sku;
          http.get("http://api.remix.bestbuy.com/v1/products(sku=" + sku + ")+stores?show=name,sku,stores&format=json&apiKey=kpxpjpgkvyke9r8aub9urpna", function(res) {
            var producttextdata = "";
            res.on("data", function(chunk) {
              producttextdata += chunk;
            });
            res.on("end", function() {
              var productdata = JSON.parse(producttextdata);
              var product = {};
              product.name = productdata.products[0].name;
              product.stores = [];
              var stores = productdata.products[0].stores;
              for (var i = 0; i < stores.length; i++) {
                var store = {"name": "Best Buy", "lat": stores[i].lat, "lng": stores[i].lng};
                product.stores.push(store);
              }
              console.log(product.stores);
            });
          });
        }
      });
    });
  }
};
