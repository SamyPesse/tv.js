define([
    "Underscore",
    "hr/hr",
    "vendors/socket.io"
], function(_, hr, io) {
    var logging = hr.Logger.addNamespace("updates");
    var Updates = new (hr.Class.extend({
        /* Constructor */
        initialize: function() {
            this.url = [window.location.protocol, '//', window.location.host].join('');
            logging.log("Connexion to "+this.url);
            this.socket = io.connect(this.url);

            // Video streaming stats
            this.socket.on('stats', _.bind(function(data) {
                logging.log("streaming stats ", data);
                this.trigger("streaming:stats", data);
            }, this));

            // Remote control connected
            this.socket.on('remote', _.bind(function() {
                logging.log("remote is connected");
                this.trigger("remote:start");
            }, this));

            // Touch input from remote
            this.socket.on('remote_input', _.bind(function(data) {
                logging.log("remote input ", data);
                this.trigger("remote:input", data);
            }, this));

            // Search from remote
            this.socket.on('remote_navigate', _.bind(function(page) {
                logging.log("remote navigate ", page);
                this.trigger("remote:search", page);
                hr.History.navigate(page);
            }, this));

            // Connexion error
            this.socket.on('error', _.bind(function(data) {
                logging.error("error in socket.io")
            }, this));
            return this;
        },
    }));

    return Updates;
});