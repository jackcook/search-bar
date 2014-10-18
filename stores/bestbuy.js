var http = require('http');

module.exports = {
  get_locations: function(product) {
  	http.get("http://www.google.com/index.html", function(res) {
	  console.log("Got response: " + res.statusCode);
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
    return ['10028', product]; //return array of arrays of coordinates
  }
};



var store = {
	"name": "Best Buy",
	"lat": "gasrgatwertga",
	"long": "garfweafawefae"
};