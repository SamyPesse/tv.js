define([
    "Underscore",
    "jQuery",
    "yapp/yapp"
], function(_, $, yapp, Updates) {
    var logging = yapp.Logger.addNamespace("keyboard");

    // List Item View
    var Keyboard = yapp.View.extend({
        className: "keyboard",
        template: "keyboard.html",
        events: {
            
        },
        initialize: function() {
            Keyboard.__super__.initialize.apply(this, arguments);
            return this;
        },
        templateContext: function() {
            return {
                "lines": [
                    _.range(49, 49+15), /* 1, 2, ... @ */
                    _.range(65, 65+26), /* A, B, ... Z */
                    _.range(97, 97+26),
                    [32]
                ]
            }
        },

        finish: function() {
            return Keyboard.__super__.finish.apply(this, arguments);
        },

        /* Bind to an input */
        bindTo: function(input) {
            input.focus(_.bind(function() {
                this.show();
            }, this));
            input.blur(_.bind(function() {
                this.hide();
            }, this));
            return this;
        },

        /* Show player */
        show: function() {
            this.$el.addClass("active");
        },

        /* Hide player */
        hide: function() {
            this.$el.removeClass("active");
        }
    });

    yapp.View.Template.registerComponent("keyboard", Keyboard);

    return Keyboard;
});