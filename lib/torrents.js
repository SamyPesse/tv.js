var Q = require('q');
var _ = require("underscore");

var http = require('./http');

var SEARCH_URL = "http://ca.isohunt.com/js/json.php?";

// Normalize torrent data
var normalize = function(data) {
    return {
        "title": data.title,
        "url": data.enclosure_url,
        "size": data.size,
        "seeds": data.Seeds,
        "leechers": data.leechers,
        "score": data.votes
    };
};

// Search torrents
var search = function(query) {
    var params = {
        "ihq": query
    };
    return http.request(SEARCH_URL, {
        qs: params
    })
    .then(function(data) {
        if (data.items === null ||
            data.items.list === null ||
            _.size(data.items.list) === 0
        ) {
            throw new Error("No torrents found");
        }

        return _.map(data.items.list, normalize);
    });
};

// Picks the best torrent
// For now that's the first one
var searchBest = function(query) {
    return search(query)
    .then(function(results) {
        var winner, max = 0;
        _.each(results, function(el){
            if (el.seeds + (el.score*3) > max && (el.score > 0 || !el.score)){
                winner = el;
                max = el.seeds + (el.score*3);
            }
        });
        console.log(winner);
        return winner;
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