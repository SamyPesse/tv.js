require([
    "Underscore",
    "jQuery",
    "yapp/yapp",
    "yapp/args",
    "vendors/socket.io",
    "vendors/quo",
    "ressources/imports",
], function(_, $, yapp, args, io, Quo) {
    // Configure yapp
    yapp.configure(args, {});

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
            var self = this;
            var r = $$(".swipe-container");
            r.swipeLeft(function() {
                self.sendTouch(37);
            });
            r.swipeRight(function() {
                self.sendTouch(39);
            });
            r.swipeDown(function() {
                self.sendTouch(40);
            });
            r.swipeUp(function() {
                self.sendTouch(38);
            });

            return Application.__super__.finish.apply(this, arguments);
        },

        sendTouch: function(e) {
            var key = e;
            if (!_.isNumber(e)) {
                e.preventDefault();
                key = $(e.currentTarget).data("key");
            }
            this.socket.emit('remote_input', key);
        }
    });

    var app = new Application();
    app.run();
});