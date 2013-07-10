define([
    "yapp/yapp"
], function (yapp) {
    var Settings = new (yapp.Class.extend({
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
            return yapp.Storage.get("settings_"+key) || this.defaults[key];
        },

        /*
         *  Set a settings
         */
        set: function(key, value) {
            yapp.Storage.set("settings_"+key, value);
            this.trigger("change:"+key, value);
        }
    }));
    return Settings;
});