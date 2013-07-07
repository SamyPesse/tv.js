var static = require('../static');


function mainHome(req, res) {
    res.sendfile(static.MAIN_INDEX);
}

function remoteHome(req, res) {
    res.sendfile(static.REMOTE_INDEX);
}

// Exports
exports.mainHome = mainHome;
exports.remoteHome = remoteHome;