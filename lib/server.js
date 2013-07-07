// Requires
var express = require('express');

var setupRoutes = require('./routes').setupRoutes;

var middleware = require('./middleware');

var socketio = require('socket.io');


function startServer(port) {
    var app = express();
    var server = app.listen(port);

    // Setup socket.io
    var io = socketio.listen(server, {log: false});

    //
    // Middleware
    //

    // Serve static
    app.use("/static", middleware.mainStaticDir());
    app.use("/remote/static", middleware.remoteStaticDir());

    // TV object
    // Exposes movies and torrents modules
    app.use(middleware.tv());

    // Player
    app.use(middleware.player(io, {}));

    // Remote broadcaster
    app.use(middleware.remote(io, {}));

    //
    // Routes
    //

    // Setup routes
    setupRoutes(app);

    return server;
}

// Exports
exports.startServer = startServer;
