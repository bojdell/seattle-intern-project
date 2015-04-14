var express = require('express');
var path    = require('path'),
	fs      = require('fs');;

var app = express();

app.use(express.static(path.join(__dirname, '.')));

app.get('/', function(req, res){
	res.sendfile(path.resolve('serve/index.html'));
});

app.listen(4000);
console.log("Listening on port 4000");
