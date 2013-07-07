// Requires
var express = require('express');

var Player = require('./player').Player;

var STATIC_DIR = require('./static').STATIC_DIR;

var _tv = {
    movies: require('./movies'),
    torrents: require('./torrents')
};


function tv() {
    return function(req, res, next) {
        req.tv = _tv;
        return next();
    };
}

function player(socketio, options) {
    var _player = new Player(socketio, options);

    return function(req, res, next) {
        req.player = _player;
        return next();
    };
}

function staticDir() {
    return express.static(STATIC_DIR);
}

// Exports
exports.tv = tv;
exports.player = player;
exports.staticDir = staticDir;