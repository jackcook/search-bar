var app = require("../app.js");
var http = require('http');
var xml2js = require('xml2js');
var extra = {
            apiKey: '8aadd6c926121b06baee63e405982545',
            formatter: null
};

var geocoder = require('node-geocoder').getGeocoder('opencage', 'http', extra);

module.exports = {
  get_locations: function(product, zip) {
    http.get("http://www.SupermarketAPI.com/api.asmx/StoresByZip?APIKEY=c4be2f32e1&ZipCode=" + zip, function(res) {
      var storetextdata = "";
      res.on("data", function (chunk) {
        storetextdata += chunk;
      });
      res.on("end", function() {
        //XML parse
        xml2js.parseString(storetextdata, function (err, result) {        
          result = result.ArrayOfStore.Store;//result.ArrayOfStore.Store[0];
          var storeList = result;
          //console.log("\n\n\nSTORE[0] ID SWAGGER ===================================================================");
          //console.log(result[0].StoreId);
          var products = [];
          for (var i = 0; i < result.length; i++) {
            var hurr = storeList[i].Storename;
            var durr = storeList;


            //console.dir(durr);

            var address = '';
            address += durr[0].Address.toString() + " " + durr[0].City.toString() + " " + durr[0].State.toString() + " " + durr[0].Zip.toString();
            //console.log(address);

            geocoder.geocode(address, function(err, res) {
            console.log(res);
            });





            http.get("http://www.SupermarketAPI.com/api.asmx/SearchForItem?APIKEY=c4be2f32e1&StoreId=" + result[i].StoreId + "&ItemName=" + product, function(itemRes) {
              var itemTextdata = "";
              itemRes.on("data", function (chunk) {
                itemTextdata += chunk;
              });


              itemRes.on("end", function() {
                xml2js.parseString(itemTextdata, function (err, productData) {
                  productData = productData.ArrayOfProduct.Product;
                  var tempProduct = {};
                  tempProduct.stores = hurr;
                  for (var j = 0; j < productData.length; j++) {
                    //console.log(productData[j].Itemname.toString());
                    var product = {};
                    product.name = productData[j].Itemname.toString();
                    product.stores = tempProduct.stores;
                    //console.log("product: "+ product.name + " stores: " + product.stores);
                  }
                });
              });
            });
          }
        });
      });
    });
  }
};









var store = {
        "name": "Best Buy",
        "lat": "gasrgatwertga",
        "long": "garfweafawefae"
};

//TODO
//  look at all stores in a zip code:                                         http://www.SupermarketAPI.com/api.asmx/StoresByZip?APIKEY=APIKEY&ZipCode=95130
//  for each and every single store search for the item

//totally superfast