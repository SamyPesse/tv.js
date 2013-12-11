var Q = require('q');
var _ = require("underscore");

var http = require('./http');

var SEARCH_URL = "http://kickass.to/json.php?";

// Normalize torrent data
var normalize = function(data) {
    return {
        "title": data.title,
        "url": data.torrentLink,
        "size": data.size,
        "seeds": data.seeds,
        "leechers": data.leechs,
        "score": data.votes
    };
};

// Search torrents
var search = function(query) {
    var params = {
        "q": query
    };
    return http.request(SEARCH_URL, {
        qs: params
    })
    .then(function(data) {
        if (_.size(data.list) === 0
        ) {
            throw new Error("No torrents found");
        }

        return _.map(data.list, normalize);
    });
};

// Picks the best torrent
// For now that's the first one
var searchBest = function(query) {
    return search(query)
    .then(function(results) {
        return results[0];
    });
};

// Exports
exports.search = {
    /* Search torrent for a movie */
    movie: function(movie) {
        return search(movie.title);
    },

    // Pick the best movie
    movieBest: function(movie) {
        return searchBest(movie.title);
    }
};