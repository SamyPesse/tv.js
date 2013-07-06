define([
    "yapp/yapp",
    "utils/updates"
], function(yapp, Updates) {
    var logging = yapp.Logger.addNamespace("movies");

    var Movie = yapp.Model.extend({
        /* Initialize */
        initialize: function() {
            Movie.__super__.initialize.apply(this, arguments);
            this.on("set", this.subscribeNotifs, this);
            this.subscribeNotifs();
            return this;
        },

        /* Return true if the movie can be played */
        canPlay: function() {
            return this.downloadPercent() == 100;
        },

        /* Return true if is downloading */
        isDownloading: function() {
            return this.get("download.percent") >= 0 && this.downloadPercent() < 100;
        },

        /* Return true if is downloading */
        downloadPercent: function() {
            return _.max([0, this.get("download.percent")]);
        },

        /* Update percent downloading */
        updateDownloading: function(p) {
            this.set("download.percent", _.min([p, 100]));
        },

        /* Start downloading */
        download: function() {
            return yapp.Requests.getJSON("/api/movie/download/"+this.get("id")).done(_.bind(function(data) {
                this.trigger("download:start");
            }, this), _.bind(function() {
                this.trigger("download:fail");
            }, this));
        },

        /* Play the movie */
        play: function() {
            return this;
        },

        /* Get by id */
        load: function(id) {
            return yapp.Requests.getJSON("/api/movie/get/"+encodeURIComponent(id)).done(_.bind(function(data) {
                this.set(data);
            }, this));
        },

        /* Subscribe notifications */
        subscribeNotifs: function() {
            Updates.on("downloading:"+this.get("id"), function(data) {
                logging.log("download at "+data.percent);
                this.updateDownloading(data.percent);
            }, this);
            return this;
        }
    });

    return Movie;
});