define([
    "Underscore",
    "jQuery",
    "yapp/yapp",
    "utils/navigation",
], function(_, $, yapp, Navigation) {
    var logging = yapp.Logger.addNamespace("player");

    // List Item View
    var Player = yapp.View.extend({
        className: "player",
        template: "player.html",
        events: {
            
        },
        templateContext: function() {
            return {
                
            }
        },
        finish: function() {
            return Player.__super__.finish.apply(this, arguments);
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

    yapp.View.Template.registerComponent("player", Player);

    return Player;
});