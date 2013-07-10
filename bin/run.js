#!/usr/bin/env node

var config = require("../config");
var startServer = require('../').server.startServer;

// Start server
startServer(config.port);
