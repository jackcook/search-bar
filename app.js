var app = require('express')();
var http = require('http').Server(app);
var path = require('path');

app.get('/', function(req, res){
  path.join(__dirname, '../search-bar', 'index1.html')
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
