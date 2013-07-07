// Requires
var express = require('express');

var Player = require('./player').Player;
var Remote = require('./remote').Remote;

var static = require('./static');

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

function remote(socketio, options) {
    var _remote = new Remote(socketio, options);

    return function(req, res, next) {
        req.remote = _remote;
        return next();
    };
}

function mainStaticDir() {
    return express.static(static.MAIN_STATIC_DIR);
}

function remoteStaticDir() {
    return express.static(static.REMOTE_STATIC_DIR);
}

// Exports
exports.tv = tv;
exports.player = player;
exports.remote = remote;
exports.mainStaticDir = mainStaticDir;
exports.remoteStaticDir = remoteStaticDir;