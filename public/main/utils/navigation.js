define([
    "yapp/yapp",
    'vendors/mousetrap',
    'utils/tv',
    'utils/updates'
], function (yapp, Mousetrap, TV, Updates) {
    var bindings = {};

    Mousetrap.stopCallback= function(e, element, combo) {
        if (TV.check()) {
            return false;
        }
        return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || (element.contentEditable && element.contentEditable == 'true');
    };


    var Navigation = new (yapp.Class.extend({
        /*
         *  Initialize the navigation
         */
        initialize: function() {
            // Handle remote control
            Updates.on("remote:input", function(key) {
                var mapKeys = {
                    38: "up",
                    39: "right",
                    37: "left",
                    40: "down",
                    32: "space",
                    27: "esc"
                };
                key = mapKeys[key];
                Mousetrap.trigger(key);
            });

            Mousetrap.bind("space", function() {
                Mousetrap.trigger("enter");
            });

            return this;
        },

        /*
         *  Bind keyboard shortcuts to callback
         *  @keys : shortcut or list of shortcuts
         *  @callback : function to call
         */
        bind: function(keys, callback, context) {
            if (_.isArray(keys)) {
                _.each(keys, function(key) { Navigation.bind(key, callback) });
                return;
            }
            if (bindings[keys] == null) {
                bindings[keys] = new yapp.Class();
                Mousetrap.bind(keys, function() {
                    bindings[keys].trigger("action");
                });
            }
            bindings[keys].on("action", callback, context);
            return;
        },
    }));
    
    return Navigation;
});