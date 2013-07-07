#!/usr/bin/env node

var startServer = require('../').server.startServer;

// Start server
startServer(process.env.PORT || 8888);
