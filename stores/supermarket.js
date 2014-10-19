var app = require("../app.js");
var http = require('http');
var xml2js = require('xml2js');


module.exports = {
  get_locations: function(product, zip) {
    http.get("http://www.SupermarketAPI.com/api.asmx/StoresByZip?APIKEY=c4be2f32e1&ZipCode=" + zip, function(res) {
      var storetextdata = "";
      res.on("data", function (chunk) {
        storetextdata += chunk;
        console.log("RAW SWAGGER STRING ====================================================================");
        console.log(storetextdata);
      });
      res.on("end", function() {
        //XML parse
        xml2js.parseString(storetextdata, function (err, result) {
          console.log("\n\n\nJS OBJECT SWAGGER ===================================================================");
          console.dir(result);
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