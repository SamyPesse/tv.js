// Requires
var express = require('express');

var setupRoutes = require('./routes').setupRoutes;

var middleware = require('./middleware');

var socketio = require('socket.io');

var config = require('../config');

function startServer(port) {
    port = port || config.port;

    var app = express();
    var server = app.listen(port);

    server.on('listening', function() {
        console.log('Server listening on: http://localhost:'+port);
    });

    // Setup socket.io
    var io = socketio.listen(server, {log: false});

    //
    // Middleware
    //

    // Serve static
    app.use("/static", middleware.mainStaticDir());
    app.use("/remote/static", middleware.remoteStaticDir());

    // Disable x-powered-by
    app.disable('x-powered-by');

    // TV object
    // Exposes movies and torrents modules
    app.use(middleware.tv());

    // Player
    app.use(middleware.player(io, {}));

    // Remfote broadcaster
    app.use(middleware.remote(io, {}));

    //
    // Routes
    //

    // Setup routes
    setupRoutes(app);

    server.on('error', function() {
        console.error('Could not launch TV.js server on port:', port);
        process.exit();
    });

    return server;
}

// Exports
exports.startServer = startServer;
