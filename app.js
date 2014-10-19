var app = require('express')();
var express = require('express');
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var allproducts = [];

app.use("/styles", express.static(__dirname));

app.get("/", function(req, res){
  res.sendFile(path.join(__dirname, '../search-bar', 'index.html'));
});

app.get("/search.html", function(req, res) {
  res.sendFile(path.join(__dirname, "../search-bar", "search.html"));
});

io.on('connection', function(socket) {
  allproducts = [];
  socket.on('search', function(q, zip) {
    var stores = fs.readdirSync('stores');
    for (var i = 0; i < stores.length; i++) {
      var store = require(path.join(__dirname, 'stores', stores[i]));
      store.get_locations(q, parseInt(zip), function(products) {
        for (var j = 0; j < products.length; j++) {
          allproducts.push(products[j]);

          if (i == 2 && j == products.length - 1) {
            io.emit('results', allproducts);
          }
        }
      });
    }
  });
});

function all_products() {
  return allproducts;
}

http.listen(3000, function() {
  console.log("listening on *:3000");
});

function store(name, lat, lon) {
  this.name = name;
  this.lat = lat;
  this.lon = lon;
}

function product(name, stores) {
  this.name = name;
  this.stores = stores;
}
