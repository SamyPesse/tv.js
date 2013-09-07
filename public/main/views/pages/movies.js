define([
    "Underscore",
    "jQuery",
    "hr/hr",
    "views/page"
], function(_, $, hr, Page) {
    
    /*
     *  This page shows a list of movies
     *  recents movies or search results
     */
    var PageMovies = Page.extend({
        pageId: "movies",
        routes: ["home", "search/", "search/:q"],
        template: "pages/movies.html",

        /* Constructor */
        initialize: function() {
            PageMovies.__super__.initialize.apply(this, arguments);
            this.query = this.options.args[0];
            this.parent.setSearchQuery(this.query || "");
            this.parent.focusSearch();
            return this;
        },

        /* Finish rendering */
        finish: function() {
            // Set page list
            this.addList(this.components.movies);

            // Update movies list
            if (this.query == null) {
                // recents movies
                this.components.movies.recents();
            } else {
                // search
                this.components.movies.search(this.query);
            }

            return PageMovies.__super__.finish.apply(this, arguments);
        },
    });

    return PageMovies;
});