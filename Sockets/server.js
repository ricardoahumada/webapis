var express = require("express"),
app = express(),
server = require("http").createServer(app),
io = require("socket.io")(server);

app.use(express.static(__dirname + "/public"));

io.of('/canal').on("connection", function(socket) {
	console.log('Connected!!');
	console.log('Sending news...');
	socket.emit("news",{ hello: 'world' });

	socket.on('my other event', function (data) {
		console.log('my other event:',data);
	});

	socket.on('msg', function(data) {
		console.log('msg:',data);
	});

	socket.on('bye', function(data) {
		console.log('bye:',data);
		socket.disconnect();
	});

	socket.on('disconnect', function(data) {
		console.log('disconnect:',data);
	});
});

server.listen(3000);