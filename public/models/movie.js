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
            this.addToRecents();
            yapp.History.navigate("play/:id", {
                "id": this.get("id")
            });
            return yapp.Requests.getJSON("/api/movie/play/"+this.get("id")).done(_.bind(function(data) {
                this.trigger("play:start");
            }, this), _.bind(function() {
                this.trigger("play:fail");
            }, this));
        },

        /* Get by id */
        load: function(id) {
            return yapp.Requests.getJSON("/api/movie/get/"+encodeURIComponent(id)).done(_.bind(function(data) {
                this.set(data);
            }, this));
        },

        /* Add movie to recents */
        addToRecents: function() {
            var key = "movies:recents";
            var recents = yapp.Storage.get(key) || [];
            recents.unshift(this.toJSON());

            recents = _.uniq(recents, false, function(recent) {
                return recent.id;
            });

            recents = recents.slice(0, 20);
            yapp.Storage.set(key, recents);
            return this;
        }
    });

    return Movie;
});