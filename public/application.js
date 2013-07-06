require([
    "Underscore",
    "yapp/yapp",
    "yapp/args",

    "utils/navigation",

    "views/imports",
    "ressources/imports",
], function(_, yapp, args, Navigation) {
    // Configure yapp
    yapp.configure(args, {
         "logLevels": {
            "requests": "error",
            "ressources": "error",
        },
    });

    // Define base application
    var Application = yapp.Application.extend({
        name: "Movies",
        template: "main.html",
        metas: {
            "description": "Searching and watching movies made easy",
            "viewport": "width=device-width, initial-scale=1, maximum-scale=1"
        },
        links: {
            "icon": yapp.Urls.static("images/favicon.png")
        },
        routes: {
            "*actions": "routeHome",
            "search/:q": "routeSearch",
            "play/:id": "routePlay",
        },
        events: {
            "keyup .header .search": "searchInput",
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
                    if (self.page == mode) {
                        callback();
                    }
                }
            };
            var except = function(mode, callback, context) {
                callback = _.bind(callback, context);
                return function() {
                    if (self.page != mode) {
                        callback();
                    }
                }
            };

            // esc : return to homepage
            Navigation.bind('esc', _.bind(this.goHome, this));

            // movies : navigation
            Navigation.bind('right', except("player", this.components.movies.selectionRight, this.components.movies));
            Navigation.bind('left', except("player", this.components.movies.selectionLeft, this.components.movies));
            Navigation.bind('up', except("player", this.components.movies.selectionUp, this.components.movies));
            Navigation.bind('down', except("player", this.components.movies.selectionDown, this.components.movies));
            Navigation.bind('enter', except("player", this.components.movies.actionSelection, this.components.movies));

            // player
            Navigation.bind("space", only("player", this.components.player.togglePlay,  this.components.player));

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
            this.focusSearch();
            return this;
        },

        /* Route 'search' */
        routeSearch: function(q) {
            this.page = "search";
            this.components.player.hide();
            this.components.movies.search(q);
            return this;
        },

        /* Route 'search' */
        routePlay: function(id) {
            this.page = "player";
            this.components.player.show();
            return this;
        },

        /* Return to home page */
        goHome: function() {
            this.router.navigate("home");
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
        searchInput: function(e) {
            var listCodes = [
                13 /* enter */,
                40 /* down */
            ];
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 27 /* esc */) {
                this.goHome();
            } else if (_.contains(listCodes, code)) {
                this.components.movies.focus();
            }
            this.doSearch();
        },
    });

    var app = new Application();
    app.run();
});