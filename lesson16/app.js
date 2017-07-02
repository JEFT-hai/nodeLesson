var http = require('http');

var server = http.createServer(requestHandler);

function requestHandler(req,res){
	res.end('hello visitor');
}
server.listen(3000)