define([
    "yapp/yapp",
    "utils/updates"
], function(yapp, Updates) {
    var logging = yapp.Logger.addNamespace("movies");

    var Movie = yapp.Model.extend({
        /* Initialize */
        initialize: function() {
            Movie.__super__.initialize.apply(this, arguments);
            return this;
        },
        
        /* Play the movie */
        play: function() {
            yapp.History.navigate("play/:id", {
                "id": this.get("id")
            });
            /*return yapp.Requests.getJSON("/api/movie/play/"+this.get("id")).done(_.bind(function(data) {
                this.trigger("play:start");
            }, this), _.bind(function() {
                this.trigger("play:fail");
            }, this));*/
        },

        /* Get by id */
        load: function(id) {
            return yapp.Requests.getJSON("/api/movie/get/"+encodeURIComponent(id)).done(_.bind(function(data) {
                this.set(data);
            }, this));
        },
    });

    return Movie;
});