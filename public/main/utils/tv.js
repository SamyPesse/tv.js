define([
    "hr/hr"
], function (hr) {
    var TV = new (hr.Class.extend({
        enabled: true,

        /*
         *  Check if display is a TV
         */
        check: function() {
            return TV.enabled;
        },

        /*
         *  Toggle (enable or disable tv mode)
         */
        toggle: function(mode) {
            TV.enabled = mode;
            this.trigger("state", TV.enabled);
        }
    }));
    return TV;
});