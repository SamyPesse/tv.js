// Requires
var _ = require('underscore');

var tasks = require('./tasks/');


console.dir(tasks);

var ROUTES = [
    // Server Status
    ['get', '/', tasks.static.home],


    ['get', '/api/movies/get/:id', tasks.movies.get],
    ['get', '/api/movies/search/:q', tasks.movies.search],
    ['get', '/api/movies/download/:id', tasks.movies.download]
];


function setupRoutes(server) {
    _.each(ROUTES, function(route) {
        var method = route[0];
        var url = route[1];
        var view = route[2];

        console.log('Url =', url);

        server.get(url, view);
    });
}

// Exports
exports.setupRoutes = setupRoutes;
