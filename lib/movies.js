var Q = require('q');
var _ = require("underscore");

var http = require('./http');

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
        }
    };
};


exports.search = function(query) {
    var params = {
        "term": query,
        "media": "movie"
    };

    return http.request(SEARCH_URL, {
        qs: params
    })
    .then(function(data) {
        if (data.resultCount === null ||
            data.results === null
        ) {
            throw new Error("No results");
        }

        return {
            "n": data.resultCount,
            "list": _.map(data.results, normalize)
        };
    });
};

exports.get = function(id) {
    var params = {
        "id": id
    };

    return http.request(LOOKUP_URL, {
        qs: params
    })
    .then(function(data) {
        if (data.resultCount === null ||
            data.results === null ||
            _.size(data.results) === 0
        ) {
            throw new Error("No result");
        }

        return normalize(data.results[0]);
    });
};