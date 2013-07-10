define([
    "Underscore",
    "jQuery",
    "yapp/yapp",
    "models/movie",
    "views/page"
], function(_, $, yapp, Movie, Page) {
    var logging = yapp.Logger.addNamespace("movies");

    // Collection
    var Movies = yapp.Collection.extend({
        model: Movie,
        defaults: _.defaults({
            loader: "recents",
            loaderArgs: [],
            limit: 10
        }, yapp.Collection.prototype.defaults),

        /*
         *  Search movies by title, description, ...
         */
        search: function(query) {
            return yapp.Requests.getJSON("/api/movies/search/"+encodeURIComponent(query)).done(_.bind(function(data) {
                this.add(data);
            }, this));
        },

        /*
         *  Return recents movies played by user
         */
        recents: function() {
            var moviesdata = yapp.Storage.get("movies:recents") || [];
            this.add({
                list: moviesdata,
                n: _.size(moviesdata)
            });
        },
    });

    // List Item View
    var MovieItem = Page.List.Item.extend({
        className: "movie",
        template: "lists/movie.html",
        events: {
            "click .cover": "select",
            "click .play": "open"
        },
        templateContext: function() {
            return {
                object: this.model,
            }
        },

        /* Default action */
        open: function(e) {
            if (e != null) e.preventDefault();
            this.model.play();
        },
    });

    // List View
    var MoviesList = Page.List.extend({
        className: "list-movies",
        Collection: Movies,
        Item: MovieItem,
        defaults: _.defaults({
            loadAtInit: false
        }, yapp.List.prototype.defaults),

        initialize: function() {
            MoviesList.__super__.initialize.apply(this, arguments);
            return this;
        },

        /*
         *  Refresh the list with results from a search
         */
        search: function(q) {
            this.collection.options.loader = "search";
            this.collection.options.loaderArgs = [q];
            return this.refresh();
        },

        /*
         *  Refresh the list with recents played
         */
        recents: function() {
            this.collection.options.loader = "recents";
            this.collection.options.loaderArgs = [];
            return this.refresh();
        },
    });

    yapp.View.Template.registerComponent("list.movies", MoviesList);

    return MoviesList;
});