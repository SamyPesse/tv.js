var Q = require("q");
var _ = require('underscore');

var request = require('request');


 /**
  * request - Wraps the http.request function making it nice for unit testing APIs.
  *
  * @param  {string}   reqUrl   The required url in any form
  * @param  {object}   options  An options object (this is optional)
  *
  */
exports.request = function(reqUrl, options){
    var d = Q.defer();

    // Set defaults
    options = _.defaults(options || {}, {
        url: reqUrl,
        json: true
    });

    request(options, function (err, res, body) {
        if(err) {
            return d.reject(err);
        }
        return d.resolve(body);
    });

    return d.promise;
};