/*
 *  API error handling
 */
function apiError(res) {
    return function(err) {
        res.send({
            "state": "error",
            "error": err && err.toString()
        });
    };
}

/*
 *  API method "movies/search"
 *  Return list of movies corresponding to a term
 */
function search(req, res) {
    req.tv.movies.search(req.params.q)
    .done(
        res.send.bind(res),
        apiError(res)
    );
}

/*
 *  API method "movie/get"
 *  Return movie information by movie id
 */
function get(req, res) {
    req.tv.movies.get(req.params.id)
    .done(
        res.send.bind(res),
        apiError(res)
    );
}

/*
 *  API method "movie/play"
 *  Start playing a movie
 */
function play(req, res) {
    req.tv.movies.get(req.params.id)
    .then(function(movie) {
        return req.tv.torrents.search.movieBest(movie)
        .then(function(torrentResult) {
            return req.player.start(movie, torrentResult);
        });
    })
    .done(
        function() {
            res.send({});
        },
        apiError(res)
    );
}

function stop(req, res) {
    req.player.stop()
    .done(
        function() {
            res.send({});
        },
        apiError(res)
    );
}

// Exports
exports.get = get;
exports.search = search;
exports.play = play;
exports.stop = stop;