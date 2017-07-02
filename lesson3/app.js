var express = require('express')
var superagent = require('superagent')
var cheerio = require('cheerio')

var app = express()

app.get('/',function(req,res,next){

	superagent.get('https://cnodejs.org/')
	  .end(function(err,sres){
	  	if(err){
	  		return next(err);
	  	}

	  	var $ = cheerio.load(sres.text);
	  	var items = [];
	  	$('#topic_list .topic_title').each(function(idx,element){
	  		var $element = $(element);
	  		items.push({
	  			index:idx,
	  			title:$element.attr('title'),
	  			href:$element.attr('href')
	  		})
	  	})
	  	$('#topic_list .user_avatar img').each(function(idx,element){
	  		var $element = $(element);

  			items[idx].author=$element.attr('title')
	  		
	  	})
	  	

	  	res.send(items)
	  })
})

app.listen(3000,function(){
	console.log('app is running at port 3000')
})