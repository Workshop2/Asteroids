var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs');

app.listen(8000);

function handler(req, res) {
    fs.readFile(__dirname + '/index.html',
    function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }

        res.writeHeader(200, { "Content-Type": "text/html" });
        res.end(data);
        return null;
    });
}

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
        socket.emit('news', { hello: 'world' });
    });
});






//var io = require('socket.io').listen(8000);

//io.sockets.on('connection', function (socket) {
//    socket.emit('news', { hello: 'world' });
//    socket.on('my other event', function (data) {
//        console.log(data);
//    }); 
//});



//// Load the http module to create an http server.
//var http = require('http');

//// Configure our HTTP server to respond with Hello World to all requests.
//var server = http.createServer(function (request, response) {
//    response.writeHead(200, { "Content-Type": "text/plain" });
//    response.end("Hello World\n");
//});

//// Listen on port 8000, IP defaults to 127.0.0.1
//server.listen(8000);

//// Put a friendly message on the terminal
////console.log("Server running at http://127.0.0.1:8000/");