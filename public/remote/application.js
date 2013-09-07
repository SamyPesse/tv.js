require([
    "Underscore",
    "jQuery",
    "hr/hr",
    "hr/args",
    "vendors/socket.io",
    "resources/imports",
], function(_, $, hr, args, io) {
    // Configure hr
    hr.configure(args, {});

    // Define base application
    var Application = hr.Application.extend({
        name: "Remote",
        template: "main.html",
        metas: {
            "viewport": "width=device-width, initial-scale=1, maximum-scale=1"
        },
        events: {
            "click .touch[data-key]": "sendTouch",
            "click .touch[data-navigate]": "sendNavigate",
            "keyup .search": "sendSearch"
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

        /*
         *  Click on a touch or send a keycode
         */
        sendTouch: function(e) {
            var key = e;
            if (!_.isNumber(e)) {
                e.preventDefault();
                key = $(e.currentTarget).data("key");
            }
            this.socket.emit('remote_input', key);
        },

        /*
         *  Search input change
         */
        sendNavigate: function(e) {
            var page = e;
            if (!_.isString(e)) {
                e.preventDefault();
                page = $(e.currentTarget).data("navigate");
            }
            this.socket.emit('remote_navigate', page);
        },

        /*
         *  Search input change
         */
        sendSearch: function(e) {
            var q = this.$(".search").val();
            this.sendNavigate("search/"+q);
        }
    });

    var app = new Application();
    app.run();
});