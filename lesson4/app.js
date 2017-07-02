var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var async = require('async');

var url = require('url');

var cnodeUrl = 'https://cnodejs.org/';

var app = express();


app.get('/',function(req,res){

	superagent.get(cnodeUrl)
		.end(function(err,res){
			if(err){return console.log(err);}
			var topicUrls = [];
			var $ = cheerio.load(res.text);

			$('#topic_list .topic_title').each(function(idx,element){
				var $element = $(element);
				var href = url.resolve(cnodeUrl,$element.attr('href'));
				topicUrls.push(href);
			})

			var concurrencyCount = 0;

			var fetchUrl = function (url, callback) {
			  // delay 的值在 2000 以内，是个随机的整数
			  var delay = parseInt((Math.random() * 10000000) % 2000, 10);
			  concurrencyCount++;
			  console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');
			  setTimeout(function () {
			    concurrencyCount--;
			    callback(null, url + ' html content');
			  }, delay);
			};

			async.mapLimit(topicUrls,5,function(url,callback){
				fetchUrl(url,callback)
			},function(err,result){
				console.log('final:');
				console.log(result);
			})

			// var ep = new eventproxy();

			// // 命令 ep 重复监听 topicUrls.length 次（在这里也就是 40 次） `topic_html` 事件再行动
			// ep.after('topic_html', topicUrls.length, function (topics) {
			//   // topics 是个数组，包含了 40 次 ep.emit('topic_html', pair) 中的那 40 个 pair

			//   // 开始行动
			//   topics = topics.map(function (topicPair) {
			// 	    // 接下来都是 jquery 的用法了
			// 	    var topicUrl = topicPair[0];
			// 	    var topicHtml = topicPair[1];
			// 	    var $ = cheerio.load(topicHtml);
			// 	    return ({
			// 	      title: $('.topic_full_title').text().trim(),
			// 	      href: topicUrl,
			// 	      comment1: $('.reply_content').eq(0).text().trim(),
			// 	      author1:$('.changes').find('span').eq(1).find('a').text().trim()
			// 	    });
			//   });

			//   console.log('final:');
			//   console.log(topics);
			// });

			// topicUrls.forEach(function (topicUrl) {
			//   superagent.get(topicUrl)
			//     .end(function (err, res) {
			//       console.log('fetch ' + topicUrl + ' successful');
			//       ep.emit('topic_html', [topicUrl, res.text]);
			//     });
			// });

		});	
})

app.listen(3000,function(){
	console.log('app is running at port 3000 ')
})