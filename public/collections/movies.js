define([
    "Underscore",
    "yapp/yapp",
    "models/movie"
], function(_, yapp, Movie) {
    var Movies = yapp.Collection.extend({
        model: Movie,
        defaults: _.defaults({
            loader: "search",
            loaderArgs: [],
            limit: 10
        }, yapp.Collection.prototype.defaults),

        search: function(query, options) {
            options = _.defaults(options || {}, {
                
            });

            return yapp.Requests.getJSON("/api/movies/search/"+encodeURIComponent(query)).done(_.bind(function(data) {
                this.add(data);
            }, this));
        },
    });

    return Movies;
});