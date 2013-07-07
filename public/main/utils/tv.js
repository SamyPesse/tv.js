define([

], function () {
    var TV = {
        enabled: true,

        /*
         *  Check if display is a TV
         */
        check: function() {
            return TV.enabled;
        }
    };
    return TV;
});