define([

], function () {
    var TV = {
        enabled: false,

        /*
         *  Check if display is a TV
         */
        check: function() {
            return TV.enabled;
        }
    };
    return TV;
});