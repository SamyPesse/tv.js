define([
    "Underscore",
    "jQuery",
    "yapp/yapp",
    "collections/movies"
], function(_, $, yapp, Movies) {
    var logging = yapp.Logger.addNamespace("movies");

    // List Item View
    var MovieItem = yapp.List.Item.extend({
        className: "movie",
        template: "movie.html",
        events: {
            "click .cover": "open",
            "click .download": "download",
            "click .downloading": "downloading",
            "click .play": "play"
        },
        templateContext: function() {
            return {
                object: this.model,
            }
        },
        finish: function() {
            return MovieItem.__super__.finish.apply(this, arguments);
        },

        /* (action) Open infos */
        open: function() {
            this.list.closeAll();
            this.$el.addClass("active");
        },

        /* (action) Open infos */
        close: function() {
            this.$el.removeClass("active");
        },

        /* (action) Download */
        download: function(e) {
            e.preventDefault();
            this.model.download();
        },

        /* (action) Downloading state */
        downloading: function(e) {
            e.preventDefault();
        },

        /* (action) Play */
        play: function(e) {
            e.preventDefault();
            this.model.play();
        }
    });

    // List View
    var MoviesList = yapp.List.extend({
        className: "movies",
        Collection: Movies,
        Item: MovieItem,
        defaults: _.defaults({
            loadAtInit: false
        }, yapp.List.prototype.defaults),

        search: function(q) {
            this.collection.options.loaderArgs = [q];
            return this.refresh();
        },

        /* Closeall the movie */
        closeAll: function() {
            _.each(this.items, function(item) {
                item.close();
            });
            return this;
        }
    }, {
        Collection: Movies,
        Item: MovieItem
    });

    yapp.View.Template.registerComponent("list.movies", MoviesList);

    return MoviesList;
});