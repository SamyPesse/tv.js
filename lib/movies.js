var _ = require("underscore"),
    deferred = require("./deferred"),
    qs = require('querystring'),
    http = require('./http');

var SEARCH_URL = "http://itunes.apple.com/search?";
var LOOKUP_URL = "http://itunes.apple.com/lookup?";

// Normalize movie informations
var normalize = function(movie) {
    return {
        "id": movie.trackId,
        "title": movie.trackName,
        "image": movie.artworkUrl100.replace("100x100-75", "600x600-75"),
        "description": movie.longDescription,
        "genre": movie.primaryGenreName,
        "duration": movie.trackTimeMillis,
        "date": {
            "release": movie.releaseDate
        },
        "download": {
            "percent": -1
        }
    };
};


exports.search = function(query) {
    var d = new deferred.Deferred();
    var url = SEARCH_URL + qs.stringify({
        "term": query,
        "media": "movie"
    });
    http.request(url).done(function(data) {
        if (data.resultCount == null
        || data.results == null) {
            d.reject();
            return;
        }

        d.resolve({
            "n": data.resultCount,
            "list": _.map(data.results, normalize)
        });
    });

    return d;
};

exports.get = function(id) {
    var d = new deferred.Deferred();
    var url = LOOKUP_URL + qs.stringify({
        "id": id
    });
    http.request(url).done(function(data) {
        if (data.resultCount == null
        || data.results == null
        || _.size(data.results) == 0) {
            d.reject();
            return;
        }

        d.resolve(normalize(data.results[0]));
    });

    return d;
};