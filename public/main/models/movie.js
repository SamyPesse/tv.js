define([
    "hr/hr",
    "utils/updates"
], function(hr, Updates) {
    var logging = hr.Logger.addNamespace("movies");

    var Movie = hr.Model.extend({
        /* Initialize */
        initialize: function() {
            Movie.__super__.initialize.apply(this, arguments);
            return this;
        },
        
        /* Play the movie */
        play: function() {
            this.addToRecents();
            hr.History.navigate("play/:id", {
                "id": this.get("id")
            });
            return this;
        },

        /* Get by id */
        load: function(id) {
            return hr.Requests.getJSON("/api/movie/get/"+encodeURIComponent(id)).done(_.bind(function(data) {
                this.set(data);
            }, this));
        },

        /* Add movie to recents */
        addToRecents: function() {
            var key = "movies:recents";
            var recents = hr.Storage.get(key) || [];
            recents.unshift(this.toJSON());

            recents = _.uniq(recents, false, function(recent) {
                return recent.id;
            });

            recents = recents.slice(0, 20);
            hr.Storage.set(key, recents);
            return this;
        }
    });

    return Movie;
});