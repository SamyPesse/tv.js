define([
    "hr/hr"
], function (hr) {
    var Settings = new (hr.Class.extend({
        enabled: true,
        defaults: {
            "language": "en",
            "search_movies": "itunes",
            "search_torrents": "isohunt"
        },

        /*
         *  Get a settings value
         */
        get: function(key) {
            return hr.Storage.get("settings_"+key) || this.defaults[key];
        },

        /*
         *  Set a settings
         */
        set: function(key, value) {
            hr.Storage.set("settings_"+key, value);
            this.trigger("change:"+key, value);
        }
    }));
    return Settings;
});