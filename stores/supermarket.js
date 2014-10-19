var app = require("../app.js");
var http = require('http');
var xml2js = require('xml2js');
var extra = {
  apiKey: '8aadd6c926121b06baee63e405982545',
  formatter: null
};

var geocoder = require('node-geocoder').getGeocoder('opencage', 'http', extra);

module.exports = {
  get_locations: function(product, zip, callback) {
    http.get("http://www.SupermarketAPI.com/api.asmx/StoresByZip?APIKEY=c4be2f32e1&ZipCode=" + zip, function(res) {
      var storetextdata = "";
      res.on("data", function (chunk) {
        storetextdata += chunk;
      });
      res.on("end", function() {
        var products = [];
        xml2js.parseString(storetextdata, function (err, result) {
          result = result.ArrayOfStore.Store;
          var storeList = result;
          if (result == undefined) {
            return;
          }

          for (var i = 0; i < result.length; i++) {
            (function(i){
              var hurr = storeList[i].Storename;
              var durr = storeList;

              var address = '';
              address += durr[i].Address.toString() + " " + durr[i].City.toString() + " " + durr[i].State.toString() + " " + durr[i].Zip.toString();
              var place = i;
              geocoder.geocode(address, function(err, rezz) {
                var latitude = rezz[0].latitude;
                var longitude = rezz[0].longitude;

                http.get("http://www.SupermarketAPI.com/api.asmx/SearchForItem?APIKEY=c4be2f32e1&StoreId=" + result[i].StoreId + "&ItemName=" + product, function(itemRes) {
                  var itemTextdata = "";
                  itemRes.on("data", function (chunk) {
                    itemTextdata += chunk;
                  });

                  itemRes.on("end", function() {
                    xml2js.parseString(itemTextdata, function (err, productData) {
                      productData = productData.ArrayOfProduct.Product;
                      var tempProduct = {};
                      tempProduct.name = hurr;
                      tempProduct.lat = latitude;
                      tempProduct.lng = longitude;
                      for (var j = 0; j < productData.length; j++) {
                        var product = {};
                        product.name = productData[j].Itemname;
                        product.image = productData[j].ItemImage.toString();
                        product.stores = [];
                        product.stores.push(tempProduct);
                        product.lat = latitude;
                        product.lng = longitude;

                        var contains = false;
                        for (var k = 0; k < products.length; k++) {
                          var prod = products[k];
                          if (String(prod.name) == String(product.name)) {
                            contains = true;
                          }
                        }

                        if (!contains) {
                          products.push(product);
                        }

                        if (i == result.length - 1 && j == productData.length - 1) {
                          callback(products);
                        }
                      }
                    });
                  });
                });
              });
            })(i);
          }
        });
      });
    });
  }
};
