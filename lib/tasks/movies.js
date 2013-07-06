/*
 *  API error handling
 */
function apiError(res) {
    return function() {
        res.send({
            "state": "error"
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
 *  API method "movie/download"
 *  Start downloading a movie
 */
function download(req, res) {
    req.tv.movies.get(req.params.id)
    .done(function(data) {
        downloader.start(data);
        res.send({});
    }, apiError(res));
}

// Exports
exports.get = get;
exports.search = search;
exports.download = download;