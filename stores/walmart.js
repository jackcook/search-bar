var http = require("http");

module.exports = {
  get_locations: function(product, zip, callback) {
    http.get("http://api.walmartlabs.com/v1/search?apiKey=rr6nyujv7h4y5wvgr5abfcyx&query=" + product, function(res) {
      var nametextdata = "";
      res.on("data", function(chunk) {
        nametextdata += chunk;
      });
    });
  }
}
