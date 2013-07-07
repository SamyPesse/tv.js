// Require
var Q = require('q');
var _ = require('underscore');

var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var http = require('./http');

var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;


// Output
var socket = null;


// A play using peerflix
function Player(socketio, options) {
    options = options || {};

    // Socket IO for broadcasting
    this.socketio = socketio;

    // Port for peerflix to use
    this.streamPort = options.streamPort || 8769;
    this.statsPort = options.statsPort || 11470;

    // Rules for checking if peerflix has booted
    this.maxRetries = options.maxRetries || 100;
    this.retryPeriod = options.retryPeriod || 100; // 100ms

    // Time to wait for killing
    this.killTimeout = options.killTimeout || 10000; // 10s

    // Is the peerflix meant to be running
    this.isRunning = false;

    // Stats interval
    this.statsPeriod = options.statsPeriod || 500; // 500ms
    this.statsInterval = null;

    // Unset attributes
    this.movie = null;  // Movie object
    this.torrent = null;  // Torrent result used
    this.peerflix = null;  // Spawned peerflix process

    // Bind methods
    _.bindAll(this);
}
inherits(Player, EventEmitter);

Player.prototype.streamUrl = function(first_argument) {
    return 'http://localhost:' + this.streamPort;
};

Player.prototype.statsUrl = function() {
    return 'http://localhost:' + this.statsPort;
};

Player.prototype._peerflixBin = function() {
    return path.resolve(
        __dirname,
        '../node_modules/.bin/peerflix'
    );
};

Player.prototype.moviesDir = function() {
    return path.resolve(
        __dirname,
        '../movies/'
    );
};

Player.prototype.stats = function() {
    return http.request(this.statsUrl());
};

// Send stats to user over socker.io
Player.prototype.broadcastStats = function(first_argument) {
    var that = this;

    this.stats()
    .done(function(stats) {
        that.socketio.sockets.emit("stats", stats);
    });
};

Player.prototype.setupMoviesDir = function() {
    var _dir = this.moviesDir();

    var exists = fs.existsSync(_dir);

    // Skip
    if(exists) {
        return Q();
    }

    // Create
    return Q.nfcall(fs.mkdir, this.moviesDir());
};

// Cache path for a movie
Player.prototype.moviePath = function(movie) {
    return path.join(this.moviesDir(), movie.id.toString());
};

Player.prototype.start = function(movie, torrent) {
    var that = this;

    return this.setupMoviesDir()
    .then(function() {
        // Setup peerflix
        return that.startPeerflix(that.moviePath(movie), torrent.url);
    })
    .then(this.startStats)
    .then(function() {
         // Set current stuff
        that.movie = movie;
        that.torrent = torrent;
    });
};

Player.prototype.stop = function() {
    var that = this;

    this.peerflix = null;

    return this.stopPeerflix()
    .then(this.stopStats)
    .then(function() {
        that.movie = null;
        that.torrent = null;
        that.emit('stoped');
    });
};

Player.prototype.onPeerflixExit = function(code) {
    this.emit('killed', code);
};

Player.prototype.startStats = function() {
    this.statsInterval = setInterval(
        this.broadcastStats,
        this.statsPeriod
    );
    return Q();
};

Player.prototype.startPeerflix = function(path, torrentUrl) {
    var d = Q.defer();

    var that = this;

    // Spawn process
    this.peerflix = cp.spawn(
        // Binary path
        this._peerflixBin(),
        // Args
        [
            // Url/path of the torrent file to download and use
            torrentUrl,

            // Path of output file
            '--path', path,

            // Port to run on
            '--port', this.streamPort,

            // We want the stats server booted
            '--stats'
        ]
    );

    // Setup exit handler
    this.peerflix.once('exit', this.onPeerflixExit);

    // Return once the stats are up
    var tries = 0;

    var retry = function () {
        setTimeout(checker, that.retryPeriod);
        tries++;
    };

    var checker = function() {
        if(tries >= that.maxRetries) {
            return d.reject(new Error("Stats server is not up"));
        }

        that.stats()
        .done(function() {
            that.emit('started');
            d.resolve();
        }, retry);
    };

    // Start trying
    retry();

    return d.promise;
};

// Returns a promise for when peerflix is killed
Player.prototype._killPeerflix = function() {
    var d = Q.defer();

    var solved = false;

    // Wait to killed
    this.once('killed', function() {
        solved = true;
        d.resolve();
    });

    setTimeout(function() {
        if(solved) return;

        d.reject(new Error("Peerflix did not die correctly"));
    }, this.killTimeout);

    return d.promise;
};

Player.prototype.stopPeerflix = function() {
    // Singal killing of the process
    this.peerflix.kill();

    // Wait for kill
    return this._killPeerflix();
};

Player.prototype.stopStats = function() {
    clearInterval(this.statsInterval);
    this.statsInterval = null;
    return Q();
};


// Exports
exports.Player = Player;