var INDEX = require('../static').INDEX;

function home(req, res) {
    res.sendfile(INDEX);
}

// Exports
exports.home = home;