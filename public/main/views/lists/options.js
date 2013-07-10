define([
    "Underscore",
    "jQuery",
    "yapp/yapp",
    "utils/settings",
    "views/page"
], function(_, $, yapp, Settings, Page) {
    var logging = yapp.Logger.addNamespace("optionss");

    // Collection
    var Options = yapp.Collection.extend({
        defaults: _.defaults({
            loader: "get",
            loaderArgs: [],
            limit: 1000
        }, yapp.Collection.prototype.defaults),
        /*
         *  Return recents movies played by user
         */
        get: function() {
            return this;
        },
    });

    // List Item View
    var OptionItem = Page.List.Item.extend({
        className: "option",
        template: "lists/option.html",
        events: {
            "click": "open"
        },
        templateContext: function() {
            return {
                object: this.model,
            }
        },

        /* Constructor */
        initialize: function() {
            OptionItem.__super__.initialize.apply(this, arguments);
            Settings.on("change:"+this.list.options.settings, this.checkState, this);
            this.checkState();
            return this;
        },

        /* Default action */
        open: function(e) {
            if (e != null) e.preventDefault();
            this.select();
            Settings.set(this.list.options.settings, this.model.get("value"));
        },

        /* Check state */
        checkState: function() {
            this.$el.toggleClass("selected", Settings.get(this.list.options.settings) == this.model.get("value"));
        }
    });

    // List View
    var OptionsList = Page.List.extend({
        className: "list-options",
        Collection: Options,
        Item: OptionItem,
        defaults: _.defaults({
            loadAtInit: false,
            options: [],    // options list
            settings: null // settings key
        }, yapp.List.prototype.defaults),

        initialize: function() {
            OptionsList.__super__.initialize.apply(this, arguments);
            this.collection.add(this.options.options);
            return this;
        },
    });

    yapp.View.Template.registerComponent("list.options", OptionsList);

    return OptionsList;
});