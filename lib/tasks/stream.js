// Requires
var request = require('request');
var ffmpeg = require('fluent-ffmpeg');

var stream = require('readable-stream');

function converterStream(input, out) {
    var _stream = new stream.Duplex();

    // Setup conversion stuff
    var proc = (new ffmpeg({
        source: input
    }))
    .usingPreset('flashvideo')
    .writeToStream(out);

    return _stream;
}


function streamGet(req, res) {
    var url = req.player.moviePath(req.player.movie);

    console.log('Streamin');

    // Stream coming from peerflix
    //var originStream = req.pipe(request(url));

    // Stream to convert to OGV
    var converter = converterStream(url, res);

    // Pipe
    // request -> peerflix -> convert -> out
    // req.pipe(originStream)/*.pipe(converter)*/.pipe(res);
    //converter.pipe(res);
}

// Just return length and other info
// No need to convert here
// since there is no content obviously
function streamHead(req, res) {
    var url = req.player.streamUrl();
    request.head(url).pipe(res);
}


// Exports
exports.streamGet = streamGet;
exports.streamHead = streamHead;