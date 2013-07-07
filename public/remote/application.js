require([
    "Underscore",
    "jQuery",
    "yapp/yapp",
    "yapp/args",
    "vendors/socket.io",
    "ressources/imports",
], function(_, $, yapp, args, io) {
    // Configure yapp
    yapp.configure(args, {
         "logLevels": {

        },
    });

    // Define base application
    var Application = yapp.Application.extend({
        name: "Remote",
        template: "main.html",
        metas: {
            "viewport": "width=device-width, initial-scale=1, maximum-scale=1"
        },
        links: {

        },
        routes: {
            
        },
        events: {
            "click .touch": "sendTouch",
        },

        initialize: function() {
            Application.__super__.initialize.apply(this, arguments);

            var url = [window.location.protocol, '//', window.location.host].join('');
            this.socket = io.connect(url);
            this.socket.on('connect', _.bind(function () {
                this.socket.emit('remote', 'start');
            }, this));
            return this;
        },

        finish: function() {
            return Application.__super__.finish.apply(this, arguments);
        },

        templateContext: function() {
            return {}
        },

        sendTouch: function(e) {
            var key = 0;
            e.preventDefault();
            key = $(e.currentTarget).data("key");
            console.log("send ", key);
            this.socket.emit('remote_input', key);
        }
    });

    var app = new Application();
    app.run();
});