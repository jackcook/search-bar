var app = require('express')();
var fs = require('fs');
var http = require('http').Server(app);
var path = require('path');

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../search-bar', 'index.html'));
});

http.listen(3000, function(){
  var stores = fs.readdirSync('stores');
  for (var i = 0; i < stores.length; i++) {
    var store = require(path.join(__dirname, 'stores', stores[i]));
    var locations = store.get_locations('stuffed animal');
    console.log(locations);
  }
});
