var _ = require("underscore"),
    deferred = require("./deferred"),
    qs = require('querystring'),
    http = require('./http');

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
    var d = new deferred.Deferred();
    var url = SEARCH_URL + qs.stringify({
        "ihq": query
    });
    http.request(url).done(function(data) {
        if (data.items == null 
        || data.items.list == null
        || _.size(data.items.list) == 0) {
            d.reject();
            return;
        }
        d.resolve(_.map(data.items.list, normalize));
    });
    return d;
};

exports.search = {
    /* Search torrent for a movie */
    movie: function(movie) {
        return search(movie.title);
    }
};