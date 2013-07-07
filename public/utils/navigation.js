define([
    "yapp/yapp",
    'vendors/mousetrap',
    'utils/tv'
], function (yapp, Mousetrap, TV) {
    var bindings = {};

    Mousetrap.stopCallback= function(e, element, combo) {
        if (TV.check()) {
            return false;
        }
        return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || (element.contentEditable && element.contentEditable == 'true');
    };


    var Navigation = {
        /*
         *  Bind keyboard shortcuts to callback
         *  @keys : shortcut or list of shortcuts
         *  @callback : function to call
         */
        bind: function(keys, callback) {
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
            bindings[keys].on("action", callback);
            return;
        },
    };
    return Navigation;
});