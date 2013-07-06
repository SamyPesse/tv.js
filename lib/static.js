// Requires
var path = require('path');

// Constants
var DIR = path.resolve(__dirname, "../public/build/");

var INDEX = path.join(DIR, "index.html");
var STATIC_DIR = path.join(DIR, "static");

// Exports
exports.DIR = DIR;
exports.INDEX = INDEX;
exports.STATIC_DIR = STATIC_DIR;
