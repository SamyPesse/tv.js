define([
    'vendors/mousetrap'
], function (Mousetrap) {
    /*
     *  This method will manage in the future remote control for television
     */

    var Navigation = {
        /*
         *  Bind keyboard shortcuts to callback
         *  @keys : shortcut or list of shortcuts
         *  @callback : function to call
         */
        bind: function(keys, callback) {
            return Mousetrap.bind(keys, callback);
        }
    };
    return Navigation;
});