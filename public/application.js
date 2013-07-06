require([
    "Underscore",
    "yapp/yapp",
    "yapp/args",

    "views/imports",
    "ressources/imports"
], function(_, yapp, args) {
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
        },
        events: {
            "keyup .header .search": "doSearch",
        },

        initialize: function() {
            Application.__super__.initialize.apply(this, arguments);
            return this;
        },

        templateContext: function() {
            return {}
        },

        /* Route 'search' */
        search: function(q) {
            this.components.movies.search(q);
            return this;
        },

        /* (event) Do search */
        doSearch: _.debounce(function(e) {
            e.preventDefault();
            q = this.$(".header .search").val();
            this.router.navigate("search/:q", {
                "q": q
            });
        }, 1000),
    });

    var app = new Application();
    app.run();
});