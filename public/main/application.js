require([
    "Underscore",
    "yapp/yapp",
    "yapp/args",

    "utils/navigation",
    "utils/tv",
    "utils/updates",

    "views/imports",
    "ressources/imports",
], function(_, yapp, args, Navigation, TV, Updates) {
    // Configure yapp
    yapp.configure(args, {
         "logLevels": {
            "requests": "error",
            "ressources": "error",
        },
    });

    // Define base application
    var Application = yapp.Application.extend({
        name: "tv.js",
        template: "main.html",
        metas: {
            "viewport": "width=device-width, initial-scale=1, maximum-scale=1"
        },
        links: {
            "icon": yapp.Urls.static("images/logo_48.png")
        },
        routes: {
            "*actions": "routeHome",
            "search/:q": "routeSearch",
            "play/:id": "routePlay",
        },
        events: {
            "keydown .header .search": "searchKeydown",
            "keyup .header .search": "searchKeyup",
            "click .intro": "disableTv"
        },

        initialize: function() {
            Application.__super__.initialize.apply(this, arguments);
            this.page = null;
            this.doSearch = _.debounce(function() {
                q = this.$(".header .search").val();
                this.router.navigate("search/:q", {
                    "q": q
                });
            }, 1000);
            return this;
        },

        finish: function() {
            var self = this;
            var only = function(mode, callback, context) {
                callback = _.bind(callback, context);
                return function() {
                    if (self.page == mode
                    && !self.components.keyboard.isOpen()) {
                        callback();
                    }
                }
            };
            var except = function(mode, callback, context) {
                callback = _.bind(callback, context);
                return function() {
                    if (self.page != mode
                    && !self.components.keyboard.isOpen()) {
                        callback();
                    }
                }
            };

            // esc : return to homepage
            Navigation.bind('esc', _.bind(function() {
                if (this.components.keyboard.isOpen()) {
                    this.components.movies.focus();
                } else {
                    this.router.navigate("home");
                }
            }, this));

            // movies : navigation
            Navigation.bind('right', except("player", this.components.movies.selectionRight, this.components.movies));
            Navigation.bind('left', except("player", this.components.movies.selectionLeft, this.components.movies));
            Navigation.bind('up', except("player", this.components.movies.selectionUp, this.components.movies));
            Navigation.bind('down', except("player", this.components.movies.selectionDown, this.components.movies));
            Navigation.bind(['enter', 'space'], except("player", this.components.movies.actionSelection, this.components.movies));

            // player
            Navigation.bind(['enter', 'space'], only("player", this.components.player.togglePlay,  this.components.player));
            Navigation.bind(['left'], only("player", function() {
                this.setPlaySpeed(null, -0.25);
            },  this.components.player));
            Navigation.bind(['right'], only("player", function() {
                this.setPlaySpeed(null, 0.25);
            },  this.components.player));

            // Bind keyboard to search
            this.components.keyboard.bindTo(this.$(".header .search"));
            
            // Get tv ip
            yapp.Requests.getJSON("/api/ip").done(_.bind(function(data) {
                this.$(".intro .ip").text(data.ip);
            }, this));

            // Bind remote
            Updates.on("remote:start", function() {
                this.$(".intro").hide();
            }, this);
            Updates.on("remote:end", function() {
                this.$(".intro").show();
            }, this);

            return Application.__super__.finish.apply(this, arguments);
        },

        templateContext: function() {
            return {}
        },

        /* Route 'home' */
        routeHome: function(id) {
            this.page = "home";
            this.components.player.hide();
            this.components.movies.recents();
            this.$(".header .search").val("");
            if (!TV.check()) this.focusSearch();
            return this;
        },

        /* Route 'search' */
        routeSearch: function(q) {
            this.page = "search";
            this.$(".header .search").val(q);
            this.components.player.hide();
            this.components.movies.search(q);
            return this;
        },

        /* Route 'search' */
        routePlay: function(id) {
            this.page = "player";
            this.components.player.show(id);
            return this;
        },

        /* Focus search bar */
        focusSearch: function() {
            this.$(".header .search").focus();
            $('html, body').animate({
                "scrollTop": 0
            }, 600);
        },

        /* Blur search bar */
        blurSearch: function() {
            this.$(".header .search").blur();
        },

        /*
         *  Search input : keydown on search bar
         *      -> down|enter : go to list  
         */
        searchKeyup: function(e) {
            var listCodes = [
                13 /* enter */,
                40 /* down */
            ];
            var code = (e.keyCode ? e.keyCode : e.which);
            if (!TV.check()) {
                if (code == 27 /* esc */) {
                    this.router.navigate("home");
                } else if (_.contains(listCodes, code)) {
                    this.components.movies.focus();
                }
            }
            this.doSearch();
        },
        searchKeydown: function(e) {
            if (TV.check()) {
                e.preventDefault();
            }
        },

        /* (event) Disable tv */
        disableTv: function() {
            TV.enabled = false;
            this.$(".intro").hide();
        }
    });

    var app = new Application();
    app.run();
});