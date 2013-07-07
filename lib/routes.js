// Requires
var _ = require('underscore');

var tasks = require('./tasks/');

var ROUTES = [
    // Server Status
    ['get', '/', tasks.static.mainHome],
    ['get', '/remote', tasks.static.remoteHome],

    ['get', '/api/ip', tasks.ip.ip],


    ['get', '/api/movies/get/:id', tasks.movies.get],

    ['get', '/api/movies/search/:q', tasks.movies.search],

    ['get', '/api/movie/play/:id', tasks.movies.play],

    ['get', '/api/movie/stop', tasks.movies.stop],

    // Streaming
    ['head', '/api/stream', tasks.stream.streamHead],
    ['get', '/api/stream', tasks.stream.streamGet]
];


function setupRoutes(server) {
    _.each(ROUTES, function(route) {
        var method = route[0];
        var url = route[1];
        var view = route[2];

        server[method].call(server, url, view);
    });
}

// Exports
exports.setupRoutes = setupRoutes;
