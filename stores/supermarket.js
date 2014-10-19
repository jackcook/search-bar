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

        //XML parse
        xml2js.parseString(storetextdata, function (err, result) {        
          result = result.ArrayOfStore.Store;//result.ArrayOfStore.Store[0];
          var storeList = result;
          //console.log("\n\n\nSTORE[0] ID SWAGGER ===================================================================");
          //console.log(result[0].StoreId);
          for (var i = 0; i < result.length; i++) {
            (function(i){
              var hurr = storeList[i].Storename;
              var durr = storeList;

              //console.log(i);
              //console.dir(durr[i]);

              var address = '';
              address += durr[i].Address.toString() + " " + durr[i].City.toString() + " " + durr[i].State.toString() + " " + durr[i].Zip.toString();
              var place = i;
              geocoder.geocode(address, function(err, rezz) {
                //console.log(address);              
                var latitude = rezz[0].latitude;
                var longitude = rezz[0].longitude;
                console.log(latitude + " " + longitude);


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
                      //console.log(productData[j].Itemname.toString());
                      var product = {};
                      product.name = productData[j].Itemname;
                      product.stores = [];
                      product.stores.push(tempProduct);



                      product.lat = latitude;
                      product.lng = longitude;
                      console.log("product: "+ product.name + " stores: " + product.stores[0].name.toString() + " lat: " + product.stores[0].lat + " long: "+ product.stores[0].lng);
                      products.push(product);
                                  //console.log(products);

                      if (i == result.length - 1 && j == productData.length - 1) {
                        console.log("done");
                      }
                    }

                  });
                });
              }); //http.get items ends here
              });
            })(i);
          }//for loop ends here
        });
      });
    });
  }
};




//TODO
//  look at all stores in a zip code:                                         http://www.SupermarketAPI.com/api.asmx/StoresByZip?APIKEY=APIKEY&ZipCode=95130
//  for each and every single store search for the item

//totally superfast