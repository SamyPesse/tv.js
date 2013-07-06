#!/usr/bin/env node

var createServer = require('../').server.createServer;

// Start server
createServer().listen(process.env.PORT || 8888);
