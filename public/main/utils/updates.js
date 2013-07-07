define([
    "Underscore",
    "yapp/yapp",
    "vendors/socket.io"
], function(_, yapp, io) {
    var logging = yapp.Logger.addNamespace("updates");

    var url = [window.location.protocol, '//', window.location.host].join('');
    var Updates = new (yapp.Class.extend({}));

    logging.log("Connexion to "+url);
    Updates.socket = io.connect(url);
    Updates.socket.on('stats', function(data) {
        logging.log("streaming stats ", data);
        Updates.trigger("streaming:stats", data);
    });
    Updates.socket.on('error', function(data) {
        logging.error("error in socket.io")
    });

    return Updates;
});