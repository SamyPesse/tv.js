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

    // Video streaming stats
    Updates.socket.on('stats', function(data) {
        logging.log("streaming stats ", data);
        Updates.trigger("streaming:stats", data);
    });

    // Remote control
    Updates.socket.on('remote', function() {
        logging.log("remote is connected");
        Updates.trigger("remote:start");
    });
    Updates.socket.on('remote_input', function(data) {
        logging.log("remote input ", data);
        Updates.trigger("remote:input", data);
    });
    Updates.socket.on('remote_search', function(q) {
        logging.log("remote search ", q);
        Updates.trigger("remote:search", q);
        yapp.History.navigate("search/:q", {
            "q": q
        });
    });

    // Connexion error
    Updates.socket.on('error', function(data) {
        logging.error("error in socket.io")
    });

    return Updates;
});