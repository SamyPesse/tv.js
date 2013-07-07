define([
    "Underscore",
    "jQuery",
    "yapp/yapp",
    "utils/navigation",
    "utils/tv"
], function(_, $, yapp, Navigation, TV) {
    var logging = yapp.Logger.addNamespace("keyboard");

    // List Item View
    var Keyboard = yapp.View.extend({
        className: "keyboard",
        template: "keyboard.html",
        events: {
            
        },
        initialize: function() {
            var self = this;
            Keyboard.__super__.initialize.apply(this, arguments);

            var check = function(callback) {
                callback = _.bind(callback, self);
                return function() {
                    if (!TV.check() || !self.isOpen()) return;
                    callback();
                }
            };

            // Navigation
            Navigation.bind('right', check(this.selectionRight));
            Navigation.bind('left', check(this.selectionLeft));
            Navigation.bind('up', check(this.selectionUp));
            Navigation.bind('down', check(this.selectionDown));
            Navigation.bind(['enter', 'space'], check(this.actionSelection));

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
            this.selectionMove(0);
            return Keyboard.__super__.finish.apply(this, arguments);
        },

        /* Bind to an input */
        bindTo: function(input) {
            if (!TV.check()) return this;
            input.focus(_.bind(function() {
                this.show();
            }, this));
            input.blur(_.bind(function() {
                this.hide();
            }, this));

            this.on("input", function(keycode) {
                // Add value
                switch(keycode) {
                    case 13: /* enter */
                        input.val(input.val() + "\n");
                        break;
                    case 8: /* back */
                        input.val(input.val().substring(0,input.val().length-1));
                        break;
                    default:
                        input.val(input.val() + String.fromCharCode(keycode));
                        break;
                }

                // Trigger keydown
                var e = $.Event("keydown");
                e.which = 50;
                e.keyCode = 50;
                input.trigger(e);
            })
            return this;
        },

        /* Show player */
        show: function() {
            if (!TV.check()) return this;
            this.$el.addClass("active");
            this.trigger("open");
        },

        /* Hide player */
        hide: function() {
            this.$el.removeClass("active");
            this.trigger("close");
        },

        /* Return true if keyboard is open */
        isOpen: function() {
            return this.$el.hasClass("active");
        },

        /* Select next */
        selectionMove: function(d) {
            var activeI = this.$(".key.active").data("index");
            if (activeI == null) {
                activeI = 0;
            } else {
                activeI = activeI + d;
            }
            if (activeI < 0) activeI = this.$(".key").size() - 1;
            this.$(".key").removeClass("active");
            if (this.$(".key[data-index='"+activeI+"']").size() == 0) {
                activeI = 0;
            }
            this.$(".key[data-index='"+activeI+"']").addClass("active");
            return this;
        },

        /* Select right */
        selectionRight: function() {
            return this.selectionMove(1);
        },

        /* Select left */
        selectionLeft: function() {
            return this.selectionMove(-1);
        },

        /* Select up */
        selectionUp: function() {
            return this.selectionMove(-1);
        },

        /* Select down */
        selectionDown: function() {
            return this.selectionMove(1);
        },

        /* Action selection */
        actionSelection: function() {
            var keycode = this.$(".key.active").data("keycode");
            if (keycode == null) return;
            this.trigger("input", keycode);
        },
    });

    yapp.View.Template.registerComponent("keyboard", Keyboard);

    return Keyboard;
});