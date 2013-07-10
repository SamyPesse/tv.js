// Requires
var os = require('os');
var _ = require('underscore');
var config = require("../../config");

function getExternalIp() {
    var interfaces = os.networkInterfaces();
    return _.compact(_.flatten(_.map(interfaces, function(addresses, name) {
        // Skip loopbacks and bridges
        if( name.indexOf('lo') != -1 ||
            name.indexOf('bridge') != -1
        ) return;

        return _.map(addresses, function(address) {
            if(address.family != 'IPv4' || address.internal) return;
            return address.address;
        });
    })))[0];
}

function ip(req, res) {
    res.send({
        ip: getExternalIp(),
        port: config.port
    });
}

// Exports
exports.ip = ip;