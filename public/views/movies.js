define([
    "Underscore",
    "jQuery",
    "yapp/yapp",
    "vendors/mousetrap",
    "collections/movies"
], function(_, $, yapp, Mousetrap, Movies) {
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
            $('html, body').animate({
                "scrollTop": this.$el.offset().top-180
            }, 600);
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
        },

        /* Is active */
        isActive: function(e) {
            return this.$el.hasClass("active");
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

        initialize: function() {
            MoviesList.__super__.initialize.apply(this, arguments);
            Mousetrap.bind('right', _.bind(this.selectionRight, this));
            Mousetrap.bind('left', _.bind(this.selectionLeft, this));
            Mousetrap.bind('up', _.bind(this.selectionUp, this));
            Mousetrap.bind('down', _.bind(this.selectionDown, this));
            return this;
        },

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
        },

        /* Get index active item */
        activeIndex: function() {
            return _.reduce(this.getItemsList(), function(state, item, i) {
                if (item.isActive()) {
                    return i;
                }
                return state;
            }, null);
        },

        /* Return items by lines */
        itemsByLine: function() {
            return Math.floor(this.$el.width()/274);
        },

        /* Select next */
        selectionMove: function(d) {
            var items = this.getItemsList();
            var i = this.activeIndex();
            if (i == null) {
                i = 0;
            } else {
                i = i + d;
            }
            if (_.size(this.items) == 0) return this;

            if (i >= _.size(this.items)) i = 0;
            if (i < 0) i = _.size(this.items) - 1;
            items[i].open();
            return this;
        },

        /* Select right */
        selectionRight: function() {
            return this.selectionMove(1);
        },

        /* Select left */
        selectionLeft: function() {
            return this.selectionMove(-1);
        },

        /* Select up */
        selectionUp: function() {
            return this.selectionMove(-this.itemsByLine());
        },

        /* Select down */
        selectionDown: function() {
            return this.selectionMove(this.itemsByLine());
        }
    }, {
        Collection: Movies,
        Item: MovieItem
    });

    yapp.View.Template.registerComponent("list.movies", MoviesList);

    return MoviesList;
});