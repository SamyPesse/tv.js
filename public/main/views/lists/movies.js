define([
    "Underscore",
    "jQuery",
    "hr/hr",
    "models/movie",
    "views/page"
], function(_, $, hr, Movie, Page) {
    var logging = hr.Logger.addNamespace("movies");

    // Collection
    var Movies = hr.Collection.extend({
        model: Movie,
        defaults: _.defaults({
            loader: "recents",
            loaderArgs: [],
            limit: 10
        }, hr.Collection.prototype.defaults),

        /*
         *  Search movies by title, description, ...
         */
        search: function(query) {
            return hr.Requests.getJSON("/api/movies/search/"+encodeURIComponent(query)).done(_.bind(function(data) {
                this.add(data);
            }, this));
        },

        /*
         *  Return recents movies played by user
         */
        recents: function() {
            var moviesdata = hr.Storage.get("movies:recents") || [];
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
        }, hr.List.prototype.defaults),

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

    hr.View.Template.registerComponent("list.movies", MoviesList);

    return MoviesList;
});