// Requires
var path = require('path');

// Constants
var MAIN_DIR = path.resolve(__dirname, "../public/main/build/");
var REMOTE_DIR = path.resolve(__dirname, "../public/remote/build");

var MAIN_INDEX = path.join(MAIN_DIR, "index.html");
var MAIN_STATIC_DIR = path.join(MAIN_DIR, "static");

var REMOTE_INDEX = path.join(REMOTE_DIR, "index.html");
var REMOTE_STATIC_DIR = path.join(REMOTE_DIR, "static");


// Exports
exports.MAIN_DIR = MAIN_DIR;
exports.MAIN_INDEX = MAIN_INDEX;
exports.MAIN_STATIC_DIR = MAIN_STATIC_DIR;

exports.REMOTE_DIR = REMOTE_DIR;
exports.REMOTE_INDEX = REMOTE_INDEX;
exports.REMOTE_STATIC_DIR = REMOTE_STATIC_DIR;