var path = require("path");

exports.config = {
    // Base directory
    "base": __dirname,

    // Base url for the application
    "baseUrl": "/",

    // Application name
    "name": "Main",

    // Mode debug
    "debug": true,

    // Main entry file
    "main": "application",

    // Build directory
    "build": path.resolve(__dirname, "build"),

    // Static files
    "static": {
        "templates": path.resolve(__dirname, "ressources", "templates"),
        "images": path.resolve(__dirname, "ressources", "images"),
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
        },
        'vendors/mousetrap': {
            exports: 'Mousetrap'
        },
        'vendors/video': {
            exports: 'videojs'
        }
    }
};