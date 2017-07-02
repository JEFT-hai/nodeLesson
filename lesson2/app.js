var express = require('express');
var utility = require('utility');
var sha1 = require('sha1');

var app = express();


app.get('/',function(req,res){
	var q = (req.query.q);

	// var md5Value = utility.md5(q)

	// res.send(md5Value)
	
	var sha = sha1(q)

	res.send(sha)
})

app.listen(3000,function(){
	console.log('app is running at port 3000 ')
})