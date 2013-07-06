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
            "search/:q": "search",
            "play/:id": "play",
        },
        events: {
            "keyup .header .search": "searchInput",
        },

        initialize: function() {
            Application.__super__.initialize.apply(this, arguments);

            this.doSearch = _.debounce(function() {
                q = this.$(".header .search").val();
                this.router.navigate("search/:q", {
                    "q": q
                });
            }, 1000);

            Navigation.bind('esc', function() {
                alert("return to home");
                yapp.History.navigate("");
            });
            return this;
        },

        templateContext: function() {
            return {}
        },

        /* Route 'search' */
        search: function(q) {
            this.components.player.hide();
            this.components.movies.search(q);
            return this;
        },

        /* Route 'search' */
        play: function(id) {
            this.components.player.show();
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
            if (_.contains(listCodes, code)) {
                this.components.movies.focus();
            }
            this.doSearch();
        },
    });

    var app = new Application();
    app.run();
});