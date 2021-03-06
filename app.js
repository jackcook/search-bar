var app = require('express')();
var express = require('express');
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var allproducts = [];

app.use("/", express.static(__dirname));

app.get("/", function(req, res){
  res.sendFile(path.join(__dirname, '../search-bar', 'index.html'));
});

app.get("/search.html", function(req, res) {
  res.sendFile(path.join(__dirname, "../search-bar", "search.html"));
});

io.on('connection', function(socket) {
  socket.on('geocode', function(zip) {
    var Geocoder = require('node-geocoder-ca').Geocoder;
    var geocoder = new Geocoder();

    geocoder.geocode(String(zip), function(err, coords) {
      io.emit('location', coords.latitude, coords.longitude);
    });
  });
  socket.on('search', function(q, zip) {
    var stores = fs.readdirSync('stores');
    for (var i = 0; i < stores.length; i++) {
      var store = require(path.join(__dirname, 'stores', stores[i]));
      store.get_locations(q, parseInt(zip), function(products) {
        for (var j = 0; j < products.length; j++) {
          allproducts.push(products[j]);
        }

        io.emit('results', products);
      });
    }
  });
  socket.on('product', function(name) {
    for (var i = 0; i < allproducts.length; i++) {
      var product = allproducts[i];
      if (String(product.name) == String(name)) {
        io.emit('stores', product.stores);
        break;
      }
    }
  });
});

http.listen(80, function() {
  console.log("listening on *:80");
});
