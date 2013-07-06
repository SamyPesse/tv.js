var path = require("path");
var Client = require('node-torrent');
var torrents = require('./torrents');

// Torrent client
var client = new Client({logLevel: 'DEBUG'});

// Output
var socket = null;

// Signal progress to client
var updateState = function(movie, percent, state) {
    state = state || "ok";
    socket.emit("downloading", {
        "id": movie.id,
        "percent": percent,
        "state": state
    });
};

// Download a torrent
var download = function(movie, torrent) {
    console.log("Start downloading torrent ", torrent);
    // path.resolve(__dirname, "../a.torrent")); //
    var torrent = client.addTorrent(torrent.url);
    torrent.on('progress', function() {
        console.log("torrent progress ")
    });
    torrent.on('torrent:progress', function() {
        console.log("torrent progress 2")
    });
    torrent.on('complete', function() {
        console.log('torrent complete!');
        torrent.files.forEach(function(file) {
            console.log(file.path);
            /*var newPath = '/new/path/' + file.path;
            fs.rename(file.path, newPath);
            // while still seeding need to make sure file.path points to the right place
            file.path = newPath;*/
        });
    });
};

/* Definie socket output */
exports.output = function(sio) {
    socket = sio;
    return this;
};

/* Start downloading a file */
exports.start = function(movie) {
    console.log("[downloader] Start downloading "+movie.title);

    // Start state downloading
    updateState(movie, 0);

    // Search torrents
    torrents.search.movie(movie).then(function(results) {
        updateState(movie, 0);
        download(movie, results[0]);
    }, function() {
        updateState(movie, -1, "error");
    });
};