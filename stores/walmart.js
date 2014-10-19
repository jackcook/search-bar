var http = require("http");
var phantom = require("phantom");

module.exports = {
  get_locations: function(product, zip, callback) {
    http.get("http://api.walmartlabs.com/v1/search?apiKey=rr6nyujv7h4y5wvgr5abfcyx&query=" + product, function(res) {
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
            var iid = namedata.items[i].itemId;
            var key = i < 4 ? "rr6nyujv7h4y5wvgr5abfcyx" : "xxx";
            http.get("http://api.walmartlabs.com/v1/items/" + iid + "?apiKey=" + key, function(res) {
              var producttextdata = "";
              res.on("data", function(chunk) {
                producttextdata += chunk;
              });
              res.on("end", function() {
                http.get("http://www.walmart.com/ip/" + iid, function(res) {
                  pagetextdata = "";
                  res.on("data", function(chunk) {
                    pagetextdata += chunk;
                  });
                  res.on("end", function() {
                    var page = require("webpage").create();
                    page.open("http://www.walmart.com/ip/" + iid, function() {
                      page.render('example.png');
                      phantom.exit();
                    });
                  });
                });
              });
            });
          })(i);
        }
      });
    });
  }
}
