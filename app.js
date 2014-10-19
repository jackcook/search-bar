var app = require('express')();
var express = require('express');
var fs = require('fs');
var http = require('http').Server(app);
var path = require('path');

app.use("/styles", express.static(__dirname));

app.get("/", function(req, res){
  res.sendFile(path.join(__dirname, '../search-bar', 'index.html'));
});

http.listen(3000, function(){
  var stores = fs.readdirSync('stores');
  for (var i = 0; i < stores.length; i++) {
    var store = require(path.join(__dirname, 'stores', stores[i]));
    store.get_locations('apple', 10003, function(products) {
      console.log(products.length);
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
