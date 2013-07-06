// Requires
var express = require('express');

var STATIC_DIR = require('./static').STATIC_DIR;

var _tv = {
    movies: require('./movies'),
    downloader: require('./downloader')
};

function tv() {
    return function(req, res, next) {
        req.tv = _tv;
        return next();
    };
}

function staticDir() {
    console.log('STATIC_DIR =', STATIC_DIR);
    return express.static(STATIC_DIR);
}

// Exports
exports.tv = tv;
exports.staticDir = staticDir;