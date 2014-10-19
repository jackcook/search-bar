var http = require("http");

module.exports = {
  get_locations: function(product, zip, callback) {
    http.get("http://api.remix.bestbuy.com/v1/products(name=" + product + "*)+stores?show=name,sku,customerReviewCount&format=json&sort=customerReviewCount.desc&apiKey=kpxpjpgkvyke9r8aub9urpna", function(res) {
      var nametextdata = "";
      res.on("data", function(chunk) {
        nametextdata += chunk;
      });
      res.on("end", function() {
        var namedata = JSON.parse(nametextdata);
        var products = [];
        var received = 0;
        for (var i = 0; i < 10; i++) {
          (function(i) {
            var sku = "";

            try {
              sku = namedata.products[i].sku;
            } catch (err) {
              return;
            }

            var key = i < 4 ? "kpxpjpgkvyke9r8aub9urpna" : "z8vdb8gcwte9zxv6wyr2a6eh";
            http.get("http://api.remix.bestbuy.com/v1/products(sku=" + sku + ")+stores?show=name,sku,stores&format=json&apiKey=" + key, function(res) {
              var producttextdata = "";
              res.on("data", function(chunk) {
                producttextdata += chunk;
              });
              res.on("end", function() {
                var productdata = JSON.parse(producttextdata);
                var product = {};
                product.name = productdata.products[0].name.toString();
                if (product.name.length > 70) {
                  product.name = product.name.substring(0,70) + "...";
                }
                product.image = "http://images.bestbuy.com/BestBuy_US/images/products/" + String(sku).substring(0, 4) + "/" + sku + "_sb.jpg";
                product.stores = [];
                var stores = productdata.products[0].stores;
                for (var j = 0; j < stores.length; j++) {
                  var store = {};

                  try {
                    store = {"name": "Best Buy", "lat": stores[i].lat, "lng": stores[i].lng};
                  } catch (err) {
                    return;
                  }

                  product.stores.push(store);
                }
                products.push(product);
                received += 1;
                if (received == 10) {
                  callback(products);
                }
              });
            });
          })(i);
        }
      });
    });
  }
};
