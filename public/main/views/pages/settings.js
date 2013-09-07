define([
    "Underscore",
    "jQuery",
    "hr/hr",
    "views/page"
], function(_, $, hr, Page) {
    
    /*
     *  Possible settings :
     *      - languages
     *      - torrents source
     *      - movies sources
     *      
     */
    var PageSettings = Page.extend({
        className: "page page-settings",
        template: "pages/settings.html",
        pageId: "settings",
        routes: ["settings"],

        /* Constructor */
        initialize: function() {
            PageSettings.__super__.initialize.apply(this, arguments);
            this.parent.blurSearch();
            return this;
        },

        /* Template context */
        templateContext: function() {
            return {
                languages: [
                    {
                        "content": "English",
                        "value": "en"
                    }
                ],
                searchMovies: [
                    {
                        "content": "iTunes",
                        "value": "itunes"
                    }
                ],
                searchTorrents: [
                    {
                        "content": "Isohunt",
                        "value": "isohunt"
                    }
                ]
            }
        },

        /* Finish rendering */
        finish: function() {
            this.addList(this.components.languages);
            this.addList(this.components.search_movies);
            this.addList(this.components.search_torrents);
            this.active();
            return PageSettings.__super__.finish.apply(this, arguments);
        },
    });

    return PageSettings;
});