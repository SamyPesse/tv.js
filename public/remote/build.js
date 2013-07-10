var path = require("path");
var config = require("../../config");

exports.config = {
    // Base directory
    "base": __dirname,

    // Base url for the application
    "baseUrl": "/remote/",

    // Application name
    "name": "Remote",

    // Mode debug
    "debug": config.debug,

    // Main entry file
    "main": "application",

    // Build directory
    "build": path.resolve(__dirname, "build"),

    // Static files
    "static": {
        "templates": path.resolve(__dirname, "ressources", "templates"),
    },

    // Stylesheets
    "style": path.resolve(__dirname, "stylesheets/main.less"),

    // Modules paths
    "paths": {
        "vendors": path.resolve(__dirname, "../vendors")
    },
    "shim": {
        'vendors/socket.io': {
            exports: 'io'
        }
    }
};