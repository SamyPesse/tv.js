#!/usr/bin/env node

var express = require('express');
var http = require("http");
var path = require('path');
var tv = require("../");
var socketio = require('socket.io');
var io, downloader;

// Http server
var app = express();
app.get("/", function(req, res) {
    res.sendfile(path.resolve(__dirname, "../public/build/index.html"));
});
app.use("/static",  express.static(path.resolve(__dirname, "../public/build/static")));

/*
 *  API error handling
 */
apiError = function(res) {
    return function() {
        res.send({
            "state": "error"
        });
    };
}

/*
 *  API method "movies/search"
 *  Return list of movies corresponding to a term
 */
app.get('/api/movies/search/:q', function (req, res) {
    tv.movies.search(req.params.q).then(function(data) {
        res.send(data);
    }, apiError(res));
});

/*
 *  API method "movie/get"
 *  Return movie information by movie id
 */
app.get('/api/movie/get/:id', function (req, res) {
    tv.movies.get(req.params.id).then(function(data) {
        res.send(data);
    }, apiError(res));
});

/*
 *  API method "movie/download"
 *  Start downloading a movie
 */
app.get('/api/movie/download/:id', function (req, res) {
    tv.movies.get(req.params.id).then(function(data) {
        downloader.start(data);
        res.send({});
    }, apiError(res));
});
server = http.createServer(app);

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
downloader = tv.downloader.output(io.sockets);


// Start server
server.listen(process.env.PORT || 8888);
