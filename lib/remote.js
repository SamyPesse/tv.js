// Requires
var _ = require('underscore');

function Remote(socketio) {
    this.io = socketio;
    this.events = ['remote', 'remote_input'];

    _.bindAll(this);

    this.io.sockets.on('connection', this.handler);
}

Remote.prototype.handler = function(socket) {
    var setuper = this.setupBroacast.bind(this, socket);

    _.each(this.events, setuper);
};

Remote.prototype.setupBroacast = function(socket, eventName) {
    return socket.on(eventName, this.broadcast.bind(this, socket, eventName));
};

Remote.prototype.broadcast = function(socket, eventName, msg) {
    return socket.broadcast.emit(eventName, msg);
};

// Exports
exports.Remote = Remote;
