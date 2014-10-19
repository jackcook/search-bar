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
  socket.on('search', function(q, zip) {
    console.log(zip);
  });
});

http.listen(3000, function() {
  var stores = fs.readdirSync('stores');
  for (var i = 0; i < stores.length; i++) {
    var store = require(path.join(__dirname, 'stores', stores[i]));
    store.get_locations('apple', 10003, function(products) {
      for (var j = 0; j < products.length; j++) {
        allproducts.push(products[j]);
      }
    });
  }
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
