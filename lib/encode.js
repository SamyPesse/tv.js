// Requires
var cp = require('child_process');
var stream = require('readable-stream');

var formats = {
    'ogv': {
        mime: 'video/ogg',
        args: [
            // Grab input stream from stdin
            '-i', 'pipe:0',

            // Output as ogv
            '-f', 'ogg',
            '-b:v', '1500k',

            // Codes for Audio & Video
            '-vcodec', 'libtheora',
            '-acodec', 'libvorbis',

            // Audio bitrate
            '-ab', '160000',
            '-g', '30',

            // Pipe output to Stdout
            'pipe:1'
        ]
    }
};


function encoderStream(format, exitHandler) {
    // Launch process
    var ffmpeg = cp.spawn('ffmpeg', format.args);

    // Handle exit
    ffmpeg.on('exit', exitHandler);

    return ffmpeg;
}


// Exports
exports.formats = formats;
exports.encoderStream = encoderStream;
