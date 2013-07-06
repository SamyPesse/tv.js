// Requires
var express = require('express');

var setupRoutes = require('./routes').setupRoutes;

var middleware = require('./middleware');

var socketio = require('socket.io');

var downloader = require('./downloader');


function createServer() {
    var server = express();

    // Middleware

    // Serve static
    server.use("/static", middleware.staticDir());

    // TV object
    server.use(middleware.tv());

    /*
     *  Socket.IO
     */
    io = socketio.listen(server);
    io.sockets.on('connection', function (socket) {
        socket.json.send({ a: 'b' });
    });

    /*
     *  Downloader
     */
    //downloader = downloader.output(io.sockets);

    //server.use(restify.jsonp());

    // Setup routes
    setupRoutes(server);

    return server;
}

// Exports
exports.createServer = createServer;
